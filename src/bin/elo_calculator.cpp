#include <iostream>
#include <cmath>
#include <cstdlib>

/*
 * Elo Rating Calculator
 * This program calculates the Elo rating change and prints it.
 */

// Function to calculate the expected score for a player
double expectedScore(double ratingA, double ratingB) {
    return 1.0 / (1.0 + pow(10, (ratingB - ratingA) / 400));
}

// Function to calculate the Elo rating change
double calculateEloChange(double ratingA, double ratingB, int result, double K = 100) {
    // K = K * (std::max(ratingA, ratingB) / std::min(ratingA, ratingB));
    double expectedA = expectedScore(ratingA, ratingB);
    double actualA = (result == -1) ? 1.0 : (result == 0) ? 0.5 : 0.0;
    return K * (actualA - expectedA);
}

int main(int argc, char* argv[]) {
    if (argc != 5) {
        return 1;
    }

    double rating1 = std::atof(argv[1]);
    double rating2 = std::atof(argv[2]);
    int result = std::atoi(argv[3]);
    int k = std::atoi(argv[4]);

    double eloChange = calculateEloChange(rating1, rating2, result, k);
    std::cout << std::ceil(eloChange) << std::endl;  // Output Elo rating change
    return 0;
}

