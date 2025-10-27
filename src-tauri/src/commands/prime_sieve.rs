use serde::{Deserialize, Serialize};
use std::time::Instant;

#[derive(Debug, Serialize, Deserialize)]
pub struct PrimeResult {
    pub count: usize,
    pub elapsed_ms: f64,
    pub limit: u32,
}

#[tauri::command]
pub fn calculate_primes_rust(limit: u32) -> PrimeResult {
    let start = Instant::now();

    if limit < 2 {
        return PrimeResult {
            count: 0,
            elapsed_ms: start.elapsed().as_secs_f64() * 1000.0,
            limit,
        };
    }

    // Sieve of Eratosthenes
    let mut is_prime = vec![true; (limit + 1) as usize];
    is_prime[0] = false;
    is_prime[1] = false;

    let sqrt_limit = (limit as f64).sqrt() as usize;
    for i in 2..=sqrt_limit {
        if is_prime[i] {
            let mut j = i * i;
            while j <= limit as usize {
                is_prime[j] = false;
                j += i;
            }
        }
    }

    let count = is_prime.iter().filter(|&&x| x).count();
    let elapsed = start.elapsed();

    PrimeResult {
        count,
        elapsed_ms: elapsed.as_secs_f64() * 1000.0,
        limit,
    }
}
