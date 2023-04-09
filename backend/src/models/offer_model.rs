use mongodb::bson::oid::ObjectId;
use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct Offer {
    #[serde(rename = "_id", skip_serializing_if = "Option::is_none")]
    pub id: Option<ObjectId>,
    pub partner_name: String,
    pub name: String,
    pub description: String,
    pub num: i32,
    pub cost: i32,
    pub category: String,
    pub token: String,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct UserOffer {
    #[serde(rename = "_id", skip_serializing_if = "Option::is_none")]
    pub id: Option<ObjectId>,
    pub name: String,
    pub description: String,
    pub cost: i32,
    pub category: String,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct OfferPayment {
    pub offer_id: String,
    pub user_id: String,
}
