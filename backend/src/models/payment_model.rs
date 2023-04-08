use crate::models::transaction_model::Transaction;
use mongodb::bson::oid::ObjectId;
use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct Payment {
    pub transaction: Transaction,
    pub date: String,
}
