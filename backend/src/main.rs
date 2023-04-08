mod api;
mod models;
mod repository;

// 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
#[macro_use] extern crate rocket;
use rocket::{get, http::Status, serde::json::Json};
use crate::repository::repository::MongoRepo;
use api::user_api::{create_user, get_user};

#[launch]
fn rocket() -> _ {
    let db = MongoRepo::init();
    rocket::build().manage(db).mount("/", routes![create_user])
}
