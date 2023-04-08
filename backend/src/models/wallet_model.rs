use crate::models::transaction_model::Transaction;
use mongodb::bson::oid::ObjectId;
use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct Wallet {
    #[serde(rename = "_id")]
    pub id: ObjectId,
    pub e_mail: String,
    pub personal_num: String,
    pub transactions: Vec<Transaction>,
    pub history: Vec<Transaction>,
    pub messages: Vec<String>,
    pub expected_buget: i32,
    pub coins: i32,
    pub currency: f64,
    pub savings: f64,
}

// #[derive(Debug, Serialize, Deserialize, Clone)]
// pub struct WalletEditInfo {
//     pub token: String,
//     pub field: String,
//     pub new_value: f32
// }
