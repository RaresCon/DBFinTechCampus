use crate::{models::user_model::User, repository::repository::MongoRepo};

use crate::models::partner_model::Partner;
use rocket::{http::Status, serde::json::Json, State};
use sha2::{digest, Digest, Sha256};

use crate::models::user_model::{BearerToken, UserLogin};

#[post("/register", data = "<new_user>")]
pub fn register(
    db: &State<MongoRepo>,
    new_user: Json<User>,
) -> Result<Json<BearerToken>, Status> {
    let pass_hash = format!(
        "{}",
        create_hash(new_user.password.clone().as_str(), Sha256::default())
    );

    let user = User {
        id: None,
        name: new_user.name.to_owned(),
        e_mail: new_user.e_mail.to_owned(),
        password: pass_hash.to_owned(),
    };
    let user_detail = db.register_user(user);

    let token = BearerToken {
        token: format!(
            "{}",
            create_hash(new_user.e_mail.clone().as_str(), Sha256::default())
        ),
    };
    match user_detail {
        Ok(_) => Ok(Json(token)),
        Err(status) => Err(status),
    }
}

#[post("/login", data = "<req_user>")]
pub fn login(
    db: &State<MongoRepo>,
    req_user: Json<UserLogin>,
) -> Result<Json<BearerToken>, Status> {
    let user_detail = db.login_user(req_user.e_mail.clone(), req_user.password.clone());

    let token = BearerToken {
        token: create_hash(req_user.e_mail.clone().as_str(), Sha256::default())
    };
    match user_detail {
        Ok(_) => Ok(Json(token)),
        Err(status) => Err(status),
    }
}

pub fn create_hash<D>(msg: &str, mut hasher: D) -> String
where
    D: Digest,
    digest::Output<D>: std::fmt::LowerHex,
{
    hasher.update(msg);
    format!("{:x}", hasher.finalize())
}
