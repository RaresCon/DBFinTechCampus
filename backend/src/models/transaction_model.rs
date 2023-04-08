use mongodb::bson::oid::ObjectId;
use serde::{Serialize, Deserialize};

#[derive(Debug, Serialize, Deserialize)]
pub struct Transaction {
    #[serde(rename = "_id", skip_serializing_if = "Option::is_none")]
    pub id: Option<ObjectId>,
    pub payer: String,
    pub receiver: String,
    pub intent: String,
    pub amount: f64,
    pub title: String,
    //pub wallet:
}