mod api;
mod models;
mod repository;

#[macro_use] extern crate rocket;
use rocket::{get, http::Status, serde::json::Json};
use crate::repository::repository::MongoRepo;
use api::user_api::{create_user, get_user};

#[get("/")]
fn hello() -> Result<Json<String>, Status> {
    Ok(Json(String::from("")))
}

#[launch]
fn rocket() -> _ {
    let db = MongoRepo::init();
    rocket::build().manage(db).mount("/", routes![create_user])
}
