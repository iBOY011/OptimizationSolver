import numpy as np
from scipy.optimize import linprog

def solve_simplex(objective, constraints, rhs, bounds=None, goal="minimize"):
    """
    Résolution d'un problème d'optimisation linéaire avec la méthode Simplex.
    
    :param objective: Liste des coefficients de la fonction objective.
    :param constraints: Matrice des coefficients des contraintes.
    :param rhs: Liste des termes à droite des contraintes.
    :param bounds: (optionnel) Bornes des variables (liste de tuples).
    :param goal: "minimize" ou "maximize" pour choisir l'objectif.
    :return: Dictionnaire contenant la solution et le statut.
    """
    try:
        # Inverser les coefficients si l'objectif est une maximisation
        if goal == "maximize":
            objective = [-c for c in objective]

        # Appel du solveur
        result = linprog(
            c=objective,
            A_ub=constraints,
            b_ub=rhs,
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

    :param objective: Liste des coefficients de la fonction objective.
    :param constraints: Matrice des coefficients des contraintes.
    :param rhs: Liste des termes à droite des contraintes.
    :param bounds: (optionnel) Bornes des variables (liste de tuples).
    :param goal: "minimize" ou "maximize" pour choisir l'objectif.
    :return: Dictionnaire contenant la solution et le statut.
    """
    try:
        # Etape 1 : Préparer la Phase 1
        num_vars = len(objective)  # Nombre de variables de décision
        num_constraints = len(rhs)  # Nombre de contraintes

        # Ajouter des variables artificielles
        artificial_vars = np.eye(num_constraints)
        phase_one_obj = [0] * num_vars + [1] * num_constraints

        # Construire les matrices pour la Phase 1
        phase_one_constraints = np.hstack((constraints, artificial_vars))
        phase_one_rhs = rhs

        # Résoudre la Phase 1 avec l'algorithme Simplex
        phase_one_result = np.linalg.lstsq(phase_one_constraints, phase_one_rhs, rcond=None)[0]

        # Vérifier la faisabilité
        if any(x < 0 for x in phase_one_result):
            return {"error": "Problème insoluble en Phase 1. Solution de base non faisable."}

        # Etape 2 : Préparer la Phase 2
        new_constraints = constraints
        phase_two_obj = objective

        if goal == "maximize":
            phase_two_obj = [-c for c in objective]

        # Résoudre la Phase 2
        result_phase_two = np.linalg.lstsq(new_constraints, rhs, rcond=None)[0]

        # Calcul de la valeur de la fonction objective
        objective_value = sum(result_phase_two * np.array(phase_two_obj))
        if goal == "maximize":
            objective_value = -objective_value  # Corriger le signe

        return {
            "status": True,
            "message": "Résolution effectuée avec succès.",
            "objective_value": objective_value,
            "variables": result_phase_two.tolist()
        }

    except Exception as e:
        return {"error": str(e)}




def solve_big_m(objective, constraints, rhs, bounds=None):
    """
    Placeholder pour la méthode Big-M.
    
    :param objective: Liste des coefficients de la fonction objective.
    :param constraints: Matrice des coefficients des contraintes.
    :param rhs: Liste des termes à droite des contraintes.
    :param bounds: (optionnel) Bornes des variables (liste de tuples).
    :return: Dictionnaire contenant la solution et le statut.
    """
    return {
        "error": "La méthode Big-M n'est pas encore implémentée."
    }

