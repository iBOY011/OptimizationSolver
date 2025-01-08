import numpy as np
from scipy.optimize import linprog

def preprocess_constraints(constraints):
    """
    Transforme les contraintes avec les opérateurs >=, <=, = en matrices compatibles avec linprog.
    """
    A_ub, b_ub, A_eq, b_eq = [], [], [], []

    for constraint in constraints:
        coefficients = constraint["coefficients"]
        operator = constraint["operator"]
        rhs = constraint["rhs"]

        if operator == "<=":
            A_ub.append(coefficients)
            b_ub.append(rhs)
        elif operator == ">=":
            A_ub.append([-c for c in coefficients])
            b_ub.append(-rhs)
        elif operator == "=":
            A_eq.append(coefficients)
            b_eq.append(rhs)
        else:
            raise ValueError(f"Opérateur non supporté : {operator}")

    return np.array(A_ub), np.array(b_ub), np.array(A_eq), np.array(b_eq)


def solve_simplex(objective, constraints, rhs, bounds=None, goal="minimize"):
    """
    Résolution d'un problème d'optimisation linéaire avec la méthode Simplex.
    """
    try:
        # Prétraiter les contraintes
        A_ub, b_ub, A_eq, b_eq = preprocess_constraints(constraints)

        # Inverser les coefficients si l'objectif est une maximisation
        if goal == "maximize":
            objective = [-c for c in objective]

        # Appel du solveur
        result = linprog(
            c=objective,
            A_ub=A_ub if len(A_ub) > 0 else None,
            b_ub=b_ub if len(b_ub) > 0 else None,
            A_eq=A_eq if len(A_eq) > 0 else None,
            b_eq=b_eq if len(b_eq) > 0 else None,
            bounds=bounds,
            method='highs'
        )

        # Ajuster la valeur de la fonction objective pour la maximisation
        objective_value = -result.fun if goal == "maximize" else result.fun

        return {
            "status": result.success,
            "message": result.message,
            "objective_value": objective_value,
            "variables": result.x.tolist()
        }

    except Exception as e:
        return {"error": str(e)}


def solve_two_phase(objective, constraints, rhs, bounds=None, goal="minimize"):
    """
    Implémentation de la méthode Two-Phase Simplex pour les problèmes d'optimisation linéaire.
    """
    try:
        # Prétraiter les contraintes
        A_ub, b_ub, A_eq, b_eq = preprocess_constraints(constraints)

        num_vars = len(objective)  # Nombre de variables de décision

        # Étape 1 : Phase 1 - Ajouter des variables artificielles
        artificial_vars = np.eye(len(b_ub))  # Matrice identité pour les variables artificielles
        phase_one_constraints = np.hstack((A_ub, artificial_vars))  # Ajouter les variables artificielles
        phase_one_obj = [0] * num_vars + [1] * len(b_ub)  # Fonction objectif pour la Phase 1


        # Résoudre la Phase 1
        result_phase_one = linprog(
            c=phase_one_obj,
            A_ub=phase_one_constraints,
            b_ub=b_ub,
            A_eq=A_eq if len(A_eq) > 0 else None,
            b_eq=b_eq if len(b_eq) > 0 else None,
            bounds=[(0, None)] * (num_vars + len(b_ub)),
            method='highs'
        )

        if not result_phase_one.success:
            return {"error": "Phase 1 échouée : " + result_phase_one.message}

        # Vérifier si toutes les variables artificielles sont nulles
        artificial_values = result_phase_one.x[num_vars:]  # Variables artificielles
        if any(val > 1e-5 for val in artificial_values):  # Tolérance pour les valeurs proches de zéro
            return {"error": "Problème non faisable. Les variables artificielles ne sont pas nulles."}

        # Étape 2 : Phase 2 - Résoudre avec la fonction objectif d'origine
        phase_two_obj = objective
        if goal == "maximize":
            phase_two_obj = [-c for c in objective]  # Maximisation -> Minimisation


        result_phase_two = linprog(
            c=phase_two_obj,
            A_ub=A_ub if len(A_ub) > 0 else None,
            b_ub=b_ub if len(b_ub) > 0 else None,
            A_eq=A_eq if len(A_eq) > 0 else None,
            b_eq=b_eq if len(b_eq) > 0 else None,
            bounds=bounds if bounds else [(0, None)] * len(phase_two_obj),
            method='highs'
        )


        if not result_phase_two.success:
            # Gestion des cas non bornés ("unbounded")
            if "unbounded" in result_phase_two.message.lower():
                return {"error": "Problème non borné : La solution n'est pas restreinte par les contraintes."}
            return {"error": "Phase 2 échouée : " + result_phase_two.message}

        # Ajuster la valeur de la fonction objectif pour la maximisation
        objective_value = -result_phase_two.fun if goal == "maximize" else result_phase_two.fun

        return {
            "status": True,
            "message": "Résolution effectuée avec succès.",
            "objective_value": objective_value,
            "variables": result_phase_two.x[:num_vars].tolist()
        }

    except Exception as e:
        return {"error": str(e)}


def solve_big_m(objective, constraints, rhs, bounds=None, goal="minimize"):
    """
    Implémentation de la méthode Big-M pour les problèmes d'optimisation linéaire.
    """
    try:
        num_vars = len(objective)  # Nombre de variables de décision
        M = 1e6  # Grande constante pour pénaliser les variables artificielles

        # Prétraitement des contraintes
        A_ub, b_ub, A_eq, b_eq = preprocess_constraints(constraints)

        # Ajouter des variables artificielles si des contraintes d'égalité existent
        num_artificial_vars = len(b_eq)  # Nombre de variables artificielles nécessaires
        artificial_vars = np.eye(num_artificial_vars) if num_artificial_vars > 0 else np.empty((0, 0))

        # Étendre les contraintes d'égalité avec les variables artificielles
        if num_artificial_vars > 0:
            A_eq_augmented = np.hstack((A_eq, artificial_vars))
        else:
            A_eq_augmented = A_eq

        # Étendre les contraintes inégales (A_ub reste inchangé)
        A_ub_augmented = np.hstack((A_ub, np.zeros((len(b_ub), num_artificial_vars)))) if len(A_ub) > 0 else np.empty((0, num_vars + num_artificial_vars))

        # Étendre la fonction objectif avec des pénalités pour les variables artificielles
        augmented_objective = list(objective) + [M] * num_artificial_vars
        if goal == "maximize":
            augmented_objective = [-c for c in augmented_objective]

        # Convertir les bornes si elles contiennent des valeurs nulles
        if bounds:
            bounds = [(b[0], None if b[1] is None else b[1]) for b in bounds]
        bounds += [(0, None)] * num_artificial_vars  # Ajout des bornes pour les variables artificielles

        # Résoudre avec linprog
        result = linprog(
            c=augmented_objective,
            A_ub=A_ub_augmented if len(A_ub_augmented) > 0 else None,
            b_ub=b_ub if len(b_ub) > 0 else None,
            A_eq=A_eq_augmented if len(A_eq_augmented) > 0 else None,
            b_eq=b_eq if len(b_eq) > 0 else None,
            bounds=bounds,
            method='highs'
        )

        if not result.success:
            return {"error": "Problème insoluble avec la méthode Big-M : " + result.message}

        # Calcul de la valeur de la fonction objectif
        objective_value = result.fun
        if goal == "maximize":
            objective_value = -objective_value

        # Extraire uniquement les variables de décision (ignorer les variables artificielles)
        decision_variables = result.x[:num_vars]
        return {
            "status": True,
            "message": "Résolution effectuée avec succès.",
            "objective_value": objective_value,
            "variables": decision_variables.tolist()
        }

    except Exception as e:
        return {"error": str(e)}
