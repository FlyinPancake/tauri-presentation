use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize)]
#[serde(rename_all = "snake_case")]
pub enum Operation {
    Add,
    Subtract,
    Multiply,
    Divide,
}

#[tauri::command]
pub fn perform_calculation(a: i32, b: i32, operation: Operation) -> Result<i32, String> {
    match operation {
        Operation::Add => Ok(a + b),
        Operation::Subtract => Ok(a - b),
        Operation::Multiply => Ok(a * b),
        Operation::Divide => {
            if b == 0 {
                Err("Cannot divide by zero".to_string())
            } else {
                Ok(a / b)
            }
        }
    }
}
