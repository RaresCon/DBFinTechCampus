mod api;
mod models;
mod repository;

// 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
#[macro_use] extern crate rocket;
use rocket::{get, http::Status, Request, Response, serde::json::Json};
use rocket::fairing::{Fairing, Info, Kind};
use rocket::http::Header;
use crate::repository::repository::MongoRepo;
use api::user_api::{create_user, get_user};

#[launch]
fn rocket() -> _ {
    let db = MongoRepo::init();
    rocket::build().attach(CorsResponse)
                   .attach(CorsRequest)
                   .manage(db)
                   .mount("/", routes![create_user])
}

pub struct CorsResponse;
pub struct CorsRequest;

#[rocket::async_trait]
impl Fairing for CorsResponse {
    fn info(&self) -> Info {
        Info {
            name: "Cross-Origin-Resource-Sharing Fairing",
            kind: Kind::Response,
        }
    }

    async fn on_response<'r>(&self, _request: &'r Request<'_>, response: &mut Response<'r>) {
        response.set_header(Header::new("Access-Control-Allow-Origin", "*"));
        response.set_header(Header::new(
            "Access-Control-Allow-Methods",
            "POST, PATCH, PUT, DELETE, HEAD, OPTIONS, GET",
        ));
        response.set_header(Header::new("Access-Control-Allow-Headers", "*"));
        response.set_header(Header::new("Access-Control-Allow-Credentials", "true"));
    }
}

#[rocket::async_trait]
impl Fairing for CorsRequest {
    fn info(&self) -> Info {
        Info {
            name: "Cross-Origin-Resource-Sharing Fairing",
            kind: Kind::Request,
        }
    }

    async fn on_request<'r>(&self, _request: &'r Request<'_>, response: &mut Response<'r>) {
        response.set_header(Header::new("Access-Control-Allow-Origin", "*"));
        response.set_header(Header::new(
            "Access-Control-Allow-Methods",
            "POST, PATCH, PUT, DELETE, HEAD, OPTIONS, GET",
        ));
        response.set_header(Header::new("Access-Control-Allow-Headers", "*"));
        response.set_header(Header::new("Access-Control-Allow-Credentials", "true"));
    }
}
