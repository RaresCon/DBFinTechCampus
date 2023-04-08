use mongodb::bson::oid::ObjectId;
use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct Transaction {
    pub payer: String,
    pub receiver: String,
    pub intent: String,
    pub amount: f64,
    pub category: String,
    pub date: String,
    pub blockchain_hash: String,
}

pub struct OngoingTransaction {

}
