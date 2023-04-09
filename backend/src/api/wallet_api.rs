use crate::{models::user_model::User, repository::repository::MongoRepo};

use crate::models::wallet_model::{Wallet, WalletEditInfo};
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

#[post("/user/wallet/add", data = "<currency>")]
pub fn set_currency(db: &State<MongoRepo>, currency: Json<WalletEditInfo>) -> Result<Status, Status> {
    db.set_currency(currency.token.to_owned(), currency.new_value.to_owned())
}

#[post("/user/edit_budget", data = "<budget>")]
pub fn set_budget(db: &State<MongoRepo>, budget: Json<WalletEditInfo>) -> Result<Status, Status> {
    db.set_budget(budget.token.to_owned(), budget.new_value.to_owned())
}
