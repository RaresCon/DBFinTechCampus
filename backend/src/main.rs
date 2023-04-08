mod api;
mod models;
mod repository;

// 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
#[macro_use] extern crate rocket;
use rocket::{get, http::Status, Request, Response, serde::json::Json};
use rocket::fairing::{Fairing, Info, Kind};
use rocket::http::{Header, Method};
use rocket_cors::AllowedHeaders;
use crate::repository::repository::MongoRepo;
use api::user_api::{create_user, get_user};

#[launch]
fn rocket() -> _ {
    let db = MongoRepo::init();
    rocket::build().manage(db)
                   .attach(CORS)
                   .mount("/", routes![create_user])
}

pub struct CORS;

#[rocket::async_trait]
impl Fairing for CORS {
    fn info(&self) -> Info {
        Info {
            name: "Add CORS headers to responses",
            kind: Kind::Response
        }
    }

    async fn on_response<'r>(&self, _request: &'r Request<'_>, response: &mut Response<'r>) {
        response.set_header(Header::new("Access-Control-Allow-Origin", "*"));
        response.set_header(Header::new("Access-Control-Allow-Methods", "POST, GET, PATCH, OPTIONS"));
        response.set_header(Header::new("Access-Control-Allow-Headers", "*"));
        response.set_header(Header::new("Access-Control-Allow-Credentials", "true"));
    }
}
