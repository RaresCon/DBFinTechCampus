use mongodb::bson::oid::ObjectId;
use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct User {
    #[serde(rename = "_id", skip_serializing_if = "Option::is_none")]
    pub id: Option<ObjectId>,
    pub name: String,
    pub e_mail: String,
    pub password: String,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct UserLogin {
    pub e_mail: String,
    pub password: String,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct BearerToken {
    pub token: String,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct PayToken {
    pub token: String,
    pub date: String,
}
