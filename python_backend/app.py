from flask import Flask, request, jsonify
from flask_cors import CORS
from solver import solve_simplex, solve_two_phase, solve_big_m

app = Flask(__name__)
CORS(app)

@app.route("/")
def home():
    return "Hello, Flask!"

@app.route("/test", methods=["GET"])
def test():
    return jsonify({"message": "Le serveur fonctionne !"}), 200


@app.route("/solve", methods=["POST"])
def solve():
    try:
        # Récupération des données envoyées par le frontend
        data = request.get_json()
        method = data.get("method")
        goal = data.get("goal", "minimize")  # Par défaut, minimisation
        objective = data.get("objective")
        constraints = data.get("constraints")
        rhs = data.get("rhs")
        bounds = data.get("bounds", None)

        # Validation des données
        if not all([method, goal, objective, constraints, rhs]):
            return jsonify({"error": "Des données manquent : method, goal, objective, constraints ou rhs."}), 400

        # Appel de la méthode de résolution appropriée
        if method == "simplex":
            solution = solve_simplex(objective, constraints, rhs, bounds, goal)
        elif method == "two_phase":
            solution = solve_two_phase(objective, constraints, rhs, bounds, goal)
        elif method == "big_m":
            solution = solve_big_m(objective, constraints, rhs, bounds, goal)
        else:
            return jsonify({"error": "Méthode non supportée."}), 400

        return jsonify(solution), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True)

