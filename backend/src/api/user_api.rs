use crate::{models::user_model::User, repository::repository::MongoRepo};
use mongodb::results::InsertOneResult;
use rocket::{http::Status, serde::json::Json, State};
use sha2::{Sha256, Digest, digest};
use sha2::digest::FixedOutput;
use crate::models::user_model::UserLogin;

#[post("/user", data = "<new_user>")]
pub fn create_user(
    db: &State<MongoRepo>,
    new_user: Json<User>,
) -> Result<Json<String>, Status> {
    let pass_hash = format!("{}", create_hash(new_user.password.clone().as_str(), Sha256::default()));

    let user = User {
        id: None,
        name: new_user.name.to_owned(),
        e_mail: new_user.e_mail.to_owned(),
        password: pass_hash.to_owned(),
    };
    let user_detail = db.create_user(user);

    let e_mail_hash = format!("{}", create_hash(new_user.e_mail.clone().as_str(), Sha256::default()));
    match user_detail {
        Ok(_user) => Ok(Json(e_mail_hash)),
        Err(_) => Err(Status::InternalServerError),
    }
}

#[post("/login", data = "<req_user>")]
pub fn get_user(db: &State<MongoRepo>, req_user: Json<UserLogin>) -> Result<Json<User>, Status> {
    let user_detail = db.get_user(req_user.e_mail.clone());
    match user_detail {
        Ok(user) => Ok(Json(user)),
        Err(_) => Err(Status::InternalServerError),
    }
}

fn create_hash<D>(msg: &str, mut hasher: D) -> String
    where
        D: Digest,
        digest::Output<D>: std::fmt::LowerHex,
{
    hasher.update(msg);
    format!("{:x}", hasher.finalize())
}
