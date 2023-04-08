extern crate dotenv;
use dotenv::dotenv;

use mongodb::{
    results::{ InsertOneResult},
    sync::{Client, Collection},
};
use mongodb::bson::doc;

use mongodb::options::ClientOptions;
use mongodb::sync::Cursor;
use rocket::http::Status;

use sha2::Sha256;
use crate::api::user_api::create_hash;
use crate::models::offer_model::Offer;
use crate::models::partner_model::Partner;
use crate::models::transaction_model::Transaction;
use crate::models::user_model::User;
use crate::models::wallet_model::Wallet;

pub struct MongoRepo {
    col_users: Collection<User>,
    col_wallets: Collection<Wallet>,
    col_partners: Collection<Partner>,
    col_offers: Collection<Offer>,
    col_transaction_block: Collection<Transaction>,
}

impl MongoRepo {
    pub fn init() -> Self {
        dotenv().ok();
        let uri = "mongodb+srv://RaresCon:LpXTTDBGwyZC3RS2@db.wrcp80s.mongodb.net/?retryWrites=true&w=majority";
        let client_options = ClientOptions::parse(uri);
        let client = Client::with_options(client_options.unwrap());

        let db = client.expect("No database found\n").database("DB");
        let col_users: Collection<User> = db.collection("User");
        let col_wallets: Collection<Wallet> = db.collection("Wallet");
        let col_partners: Collection<Partner> = db.collection("Partner");
        let col_offers: Collection<Offer> = db.collection("Offer");
        let col_transaction_block: Collection<Transaction> = db.collection("Transaction_block");
        MongoRepo { col_users, col_wallets, col_partners, col_offers, col_transaction_block }
    }

    pub fn create_user(&self, new_user: User) -> Result<InsertOneResult, Status> {
        if !self.check_user(new_user.e_mail.clone()) {
            return Err(Status::BadRequest);
        }

        let user_email_clone = new_user.e_mail.clone();
        let new_user_doc = User {
            id: new_user.id,
            name: new_user.name,
            e_mail: new_user.e_mail,
            password: new_user.password,
        };

        let user = self.col_users
                       .insert_one(new_user_doc, None)
                       .ok()
                       .expect("Error creating user\n");

        let filter = doc! {"e_mail": user_email_clone.clone()};
        let current_user = self.col_users
                               .find_one(filter, None)
                               .ok()
                               .expect("Error getting current user\n")
                               .unwrap();
        let new_wallet_doc = Wallet {
            id: None,
            user_id: current_user.id.unwrap(),
            e_mail: user_email_clone,
            personal_num: String::from("1111 1111 1111 1111"),
            coins: 100,
            currency: 0.0,
        };
        let _wallet = self.col_wallets
            .insert_one(new_wallet_doc, None)
            .ok()
            .expect("Error creating wallet\n");
        Ok(user)
    }

    pub fn login_user(&self, e_mail: String, pass: String) -> Result<User, Status> {
        let filter = doc! {"e_mail": e_mail};

        let user_detail = self
            .col_users
            .find_one(filter, None)
            .ok()
            .expect("Error getting user's detail");

        return match user_detail {
            None => {
                Err(Status::InternalServerError)
            }
            Some(details) => {
                if details.password != create_hash(pass.as_str(), Sha256::default()) {
                    return Err(Status::BadRequest);
                }
                Ok(details)
            }
        };
    }

    pub fn get_partners(&self) -> Result<Vec<Partner>, Status> {
        let iter = self.col_partners
                       .find(None, None)
                       .ok();
        match iter {
            None => { return Err(Status::InternalServerError) }
            Some(partners_cursor) => { Ok(partners_cursor.map(|temp| temp.unwrap()).collect()) }
        }
    }

    pub fn create_partner(&self, new_partner: Partner) -> Result<InsertOneResult, Status> {
        let new_partner_doc = Partner {
            id: new_partner.id,
            name: new_partner.name,
            description: new_partner.description,
            image_link: new_partner.image_link,
            token: new_partner.token,
        };

        let partner = self.col_partners.insert_one(new_partner_doc, None)
                                       .ok()
                                       .expect("Partner insert error\n");

        Ok(partner)
    }

    fn check_user(&self, user_e_mail: String) -> bool {
        let filter = doc! {"e_mail": user_e_mail};
        return match self.col_users.find_one(filter, None).ok() {
            None => { true }
            Some(_) => { false }
        }
    }
}
