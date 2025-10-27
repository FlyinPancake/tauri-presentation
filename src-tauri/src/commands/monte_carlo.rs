use rayon::prelude::*;
use serde::{Deserialize, Serialize};
use std::time::Instant;

#[derive(Debug, Serialize, Deserialize)]
pub struct MonteCarloResult {
    pub pi_estimate: f64,
    pub iterations: u64,
    pub elapsed_ms: f64,
    pub error: f64,
}

#[tauri::command]
pub fn calculate_pi_monte_carlo(iterations: u64) -> MonteCarloResult {
    let start = Instant::now();

    // Use rayon to parallelize the Monte Carlo simulation
    // Split iterations into chunks and process in parallel
    let chunk_size = 1_000_000; // Process in 1M chunks
    let num_chunks = (iterations / chunk_size) as usize;
    let remainder = iterations % chunk_size;

    // Parallel computation using rayon
    let inside_circle: u64 = (0..num_chunks)
        .into_par_iter()
        .map(|_| {
            // Each thread gets its own RNG
            use rand::Rng;
            let mut rng = rand::thread_rng();
            let mut count = 0u64;

            for _ in 0..chunk_size {
                let x: f64 = rng.gen(); // Random number between 0 and 1
                let y: f64 = rng.gen();

                // Check if point is inside the quarter circle
                if x * x + y * y <= 1.0 {
                    count += 1;
                }
            }
            count
        })
        .sum();

    // Handle remainder iterations if any
    let inside_circle = if remainder > 0 {
        use rand::Rng;
        let mut rng = rand::thread_rng();
        let mut remainder_count = 0u64;

        for _ in 0..remainder {
            let x: f64 = rng.gen();
            let y: f64 = rng.gen();

            if x * x + y * y <= 1.0 {
                remainder_count += 1;
            }
        }
        inside_circle + remainder_count
    } else {
        inside_circle
    };

    // Calculate Pi: (points in circle / total points) * 4
    let pi_estimate = 4.0 * (inside_circle as f64) / (iterations as f64);
    let error = (pi_estimate - std::f64::consts::PI).abs();
    let elapsed_ms = start.elapsed().as_secs_f64() * 1000.0;

    MonteCarloResult {
        pi_estimate,
        iterations,
        elapsed_ms,
        error,
    }
}
