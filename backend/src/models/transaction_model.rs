use mongodb::bson::oid::ObjectId;
use serde::{Serialize, Deserialize};

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct Transaction {
    pub user_id: String,
    pub payer: String,
    pub receiver: String,
    pub intent: String,
    pub amount: f64,
    pub category: String,
    pub blockchain_hash: String,
    //pub wallet:
}