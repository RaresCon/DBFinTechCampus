use crate::{models::user_model::User, repository::repository::MongoRepo};

use crate::models::wallet_model::Wallet;
use rocket::{http::Status, serde::json::Json, State};
use sha2::{digest, Digest, Sha256};
use crate::models::user_model::BearerToken;

#[post("/user/wallet", data = "<user_id>")]
pub fn get_wallet(db: &State<MongoRepo>, user_id: Json<BearerToken>) -> Result<Json<Wallet>, Status> {
    match db.get_wallet(user_id.token.to_owned()) {
        Err(status) => { Err(status) }
        Ok(wallet) => { Ok(Json(wallet)) }
    }
}

// #[post("/user/edit_wallet", data = "<>")]
