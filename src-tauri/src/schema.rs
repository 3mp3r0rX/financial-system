
table! {
    budgets (id) {
        id -> Uuid,
        name -> Varchar,
        max -> Double,
    }
}

table! {
    expenses (id) {
        id -> Uuid,
        description -> Varchar,
        amount -> Double,
        budget_id -> Uuid,
    }
}

joinable!(expenses -> budgets (budget_id));

allow_tables_to_appear_in_same_query!(
    budgets,
    expenses,
);
