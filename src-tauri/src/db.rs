


use diesel::prelude::*;
use diesel::pg::PgConnection;
use dotenv::dotenv;
use std::env;

use crate::schema::{budgets, expenses};
use crate::models::{Budget, Expense, NewExpense};

pub fn establish_connection() -> PgConnection {
    dotenv().ok();

    let database_url = env::var("DATABASE_URL").expect("DATABASE_URL must be set");
    PgConnection::establish(&database_url)
        .expect(&format!("Error connecting to {}", database_url))
}


pub fn create_expense(conn: &PgConnection, new_expense: NewExpense) -> Expense {
    diesel::insert_into(expenses::table)
        .values(&new_expense)
        .get_result(conn)
        .expect("Error saving new expense")
}


pub fn get_budgets(conn: &PgConnection) -> Vec<Budget> {
    budgets::table
        .load::<Budget>(conn)
        .expect("Error loading budgets")
}


pub fn get_expenses_for_budget(conn: &PgConnection, budget_id: i32) -> Vec<Expense> {
    expenses::table
        .filter(expenses::budget_id.eq(budget_id))
        .load::<Expense>(conn)
        .expect("Error loading expenses for the budget")
}