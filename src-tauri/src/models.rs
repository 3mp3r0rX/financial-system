
use diesel::{Queryable, Insertable};
use serde::{Deserialize, Serialize};


#[derive(Debug, Serialize, Deserialize, Queryable)]
pub struct Budget {
    pub id: i32,
    pub name: String,
    pub max_amount: f64,
}


#[derive(Debug, Serialize, Deserialize, Queryable)]
pub struct Expense {
    pub id: i32,
    pub description: String,
    pub amount: f64,
    pub budget_id: i32,
}


#[derive(Debug, Insertable, Serialize, Deserialize)]
#[table_name = "expenses"]
pub struct NewExpense {
    pub description: String,
    pub amount: f64,
    pub budget_id: i32,
}
