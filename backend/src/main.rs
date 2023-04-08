mod api;
mod models;
mod repository;

// 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
#[macro_use] extern crate rocket;
use rocket::{get, http::Status, Request, Response, serde::json::Json};
use rocket::fairing::{AdHoc, Fairing, Info, Kind};
use rocket::http::{Header, Method};
use rocket_cors::{AllowedHeaders, AllowedOrigins, CorsOptions};
use crate::repository::repository::MongoRepo;
use api::user_api::{create_user, get_user};

#[launch]
fn rocket() -> _ {
    let db = MongoRepo::init();
    let cors = CorsOptions::default().allowed_origins(AllowedOrigins::all())
                                     .allowed_methods(
                                        vec![Method::Get, Method::Post, Method::Patch]
                                            .into_iter()
                                            .map(From::from)
                                            .collect(),
                                     );

    rocket::build().manage(db)
                   .attach(cors.to_cors().unwrap())
                   .mount("/", routes![create_user])
                   .mount("/", routes![get_user])
}