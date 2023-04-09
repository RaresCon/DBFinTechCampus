use crate::models::transaction_model::Transaction;
use mongodb::bson::oid::ObjectId;
use serde::{Deserialize, Serialize};
use crate::models::offer_model::{Offer, UserOffer};
use crate::models::user_model::User;

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct Wallet {
    #[serde(rename = "_id")]
    pub id: ObjectId,
    pub name: String,
    pub e_mail: String,
    pub personal_num: String,
    pub transactions: Vec<Transaction>,
    pub history: Vec<Transaction>,
    pub subscriptions: Vec<Transaction>,
    pub messages: Vec<String>,
    pub offers: Vec<Offer>,
    pub user_offers: Vec<UserOffer>,
    pub expected_budget: u32,
    pub coins: i32,
    pub currency: f64,
    pub savings: f64,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct WalletEditInfo {
    pub token: String,
    pub new_value: u32
}
