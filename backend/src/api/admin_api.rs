use crate::{models::admin_model::Admin, repository::repository::MongoRepo};

use crate::models::partner_model::Partner;
use rocket::{http::Status, serde::json::Json, State};
use sha2::{digest, Digest, Sha256};
use crate::api::user_api::create_hash;

use crate::models::admin_model::{AdminToken, AdminLogin};
use crate::models::transaction_model::Transaction;

#[post("/admin/register", data = "<new_admin>")]
pub fn register_admin(db: &State<MongoRepo>, new_admin: Json<Admin>) -> Result<Json<AdminToken>, Status> {
    let pass_hash = format!(
        "{}",
        create_hash(new_admin.password.clone().as_str(), Sha256::default())
    );
    let secret = create_hash(pass_hash.as_str(), Sha256::default());

    let admin = Admin {
        id: None,
        name: new_admin.name.to_owned(),
        e_mail: new_admin.e_mail.to_owned(),
        password: pass_hash.clone().to_owned(),
        secret: secret.clone(),
    };

    match db.register_admin(admin) {
        Err(status) => { Err(status) }
        Ok(_) => { Ok(Json(AdminToken { token: secret })) }
    }
}

#[post("/admin/login", data = "<admin>")]
pub fn login_as_admin(db: &State<MongoRepo>, admin: Json<AdminLogin>) -> Result<Json<AdminToken>, Status> {
    match db.login_as_admin(admin.e_mail.clone(), admin.password.clone(), admin.secret.clone()) {
        Err(status) => { Err(status) }
        Ok(admin) => { Ok(Json(AdminToken { token: admin.secret })) }
    }
}

#[post("/admin/send_request", data = "<transaction>")]
pub fn request_pay(db: &State<MongoRepo>, transaction: Json<Transaction>) -> Result<Status, Status> {
    match db.request_pay_admin(transaction.payer.to_owned(),
                               transaction.receiver.to_owned(),
                               transaction.intent.to_owned(),
                               transaction.amount.to_owned(),
                               transaction.category.to_owned(),
                               chrono::offset::Local::now().to_string(),
                               " ".to_string()
                  ) {
        Err(status) => { Err(status) }
        Ok(_transaction) => { Ok(Status::Ok) }
    }
}