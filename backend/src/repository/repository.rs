extern crate dotenv;

use std::collections::LinkedList;
use chrono::{Datelike, Timelike, Utc};
use dotenv::dotenv;

use bson::oid::ObjectId as ObjId;
use mongodb::bson::doc;
use mongodb::bson::oid::ObjectId;
use mongodb::bson::*;
use mongodb::{
    bson,
    results::InsertOneResult,
    sync::{Client, Collection},
};

use mongodb::options::ClientOptions;
use mongodb::sync::Cursor;
use rocket::futures::stream::IntoAsyncRead;
use rocket::http::private::Listener;
use rocket::http::Status;
use rocket::tokio::io::Interest;
use sha2::digest::typenum::private::IsEqualPrivate;

use crate::api::user_api::create_hash;
use crate::models::offer_model::Offer;
use crate::models::partner_model::Partner;
use crate::models::transaction_model::Transaction;
use crate::models::user_model::User;
use crate::models::wallet_model::Wallet;
use sha2::Sha256;
use crate::models::admin_model::Admin;

pub struct MongoRepo {
    col_users: Collection<User>,
    col_admins: Collection<Admin>,
    col_wallets: Collection<Wallet>,
    col_partners: Collection<Partner>,
    col_offers: Collection<Offer>,
    col_bought_offers: Collection<Offer>,
    col_transaction_block: Collection<Transaction>,
    col_logged_users: Collection<User>
}

impl MongoRepo {
    pub fn init() -> Self {
        dotenv().ok();
        let uri = "mongodb+srv://RaresCon:LpXTTDBGwyZC3RS2@db.wrcp80s.mongodb.net/?retryWrites=true&w=majority";
        let client_options = ClientOptions::parse(uri);
        let client = Client::with_options(client_options.unwrap());

        let db = client.expect("No database found\n").database("DB");
        let col_users: Collection<User> = db.collection("User");
        let col_admins: Collection<Admin> = db.collection("Admin");
        let col_wallets: Collection<Wallet> = db.collection("Wallet");
        let col_partners: Collection<Partner> = db.collection("Partner");
        let col_offers: Collection<Offer> = db.collection("Offer");
        let col_bought_offers: Collection<Offer> = db.collection("BoughtOffer");
        let col_transaction_block: Collection<Transaction> = db.collection("Transaction_block");
        let col_logged_users: Collection<User> = db.collection("LoggedUsers");
        MongoRepo {
            col_users,
            col_admins,
            col_wallets,
            col_partners,
            col_offers,
            col_bought_offers,
            col_transaction_block,
            col_logged_users,
        }
    }

    pub fn register_user(&self, new_user: User) -> Result<InsertOneResult, Status> {
        if self.user_check(new_user.e_mail.clone()) {
            return Err(Status::BadRequest);
        }

        let user_email_clone = new_user.e_mail.clone();
        let new_user_doc = User {
            id: new_user.id,
            name: new_user.name,
            e_mail: new_user.e_mail,
            password: new_user.password,
        };

        let user = self
            .col_users
            .insert_one(new_user_doc.clone(), None)
            .ok()
            .expect("Error creating user\n");

        let filter = doc! {"e_mail": user_email_clone.clone()};
        let current_user = self.col_users
                               .find_one(filter, None)
                               .ok()
                               .expect("Error getting current user\n")
                               .unwrap();
        let new_wallet_doc = Wallet {
            id: current_user.id.unwrap(),
            name: current_user.name.clone(),
            e_mail: user_email_clone.clone(),
            personal_num: String::from("1111 1111 1111 1111"),
            transactions: vec![],
            history: vec![],
            messages: vec![],
            expected_buget: -1,
            coins: 100,
            currency: 0.0,
            savings: 0.0,
        };
        let _wallet = self.col_wallets
                          .insert_one(new_wallet_doc, None)
                          .ok()
                          .expect("Error creating wallet\n");

        if !self.logged_user_check(user_email_clone) {
            self.col_logged_users.insert_one(current_user.clone(), None).ok();
        }
        Ok(user)
    }

    pub fn login_user(&self, e_mail: String, pass: String) -> Result<User, Status> {
        let filter = doc! {"e_mail": e_mail.clone()};
        let user_detail = self.col_users.find_one(filter, None).ok();

        return match user_detail {
            None => Err(Status::BadRequest),
            Some(user_detail_unwraped) => match user_detail_unwraped {
                None => Err(Status::InternalServerError),
                Some(details) => {
                    if details.password != create_hash(pass.as_str(), Sha256::default()) {
                        return Err(Status::BadRequest);
                    }

                    if !self.logged_user_check(e_mail) {
                        self.col_logged_users.insert_one(details.clone(), None).ok();
                    }
                    Ok(details)
                },
            },
        };
    }

    pub fn create_partner(&self, new_partner: Partner) -> Result<InsertOneResult, Status> {
        if self.partner_check(new_partner.name.clone()) {
            return Err(Status::BadRequest);
        }

        let new_partner_doc = Partner {
            id: new_partner.id,
            name: new_partner.name,
            description: new_partner.description,
            image_link: new_partner.image_link,
            token: new_partner.token,
        };

        let partner = self
            .col_partners
            .insert_one(new_partner_doc, None)
            .ok()
            .expect("Partner insert error\n");

        Ok(partner)
    }

    pub fn get_partners(&self) -> Result<Vec<Partner>, Status> {
        let iter = self.col_partners.find(None, None).ok();
        match iter {
            None => return Err(Status::InternalServerError),
            Some(partners_cursor) => Ok(partners_cursor.map(|temp| temp.unwrap()).collect()),
        }
    }

    pub fn create_offer(&self, new_offer: Offer) -> Result<InsertOneResult, Status> {
        if !self.offer_check(new_offer.partner_name.clone(), new_offer.token.clone()) {
            return Err(Status::BadRequest);
        }

        let new_offer_doc = Offer {
            id: None,
            partner_name: new_offer.partner_name,
            name: new_offer.name,
            description: new_offer.description,
            num: new_offer.num,
            cost: new_offer.cost,
            category: new_offer.category,
            token: new_offer.token,
        };

        let offer = self
            .col_offers
            .insert_one(new_offer_doc, None)
            .ok()
            .expect("Offer insert error\n");

        Ok(offer)
    }

    pub fn get_offers(&self) -> Result<Vec<Offer>, Status> {
        let iter = self.col_offers.find(None, None).ok();
        match iter {
            None => return Err(Status::InternalServerError),
            Some(offers_cursor) => Ok(offers_cursor.map(|temp| temp.unwrap()).collect()),
        }
    }

    pub fn get_offers_for_partner(&self, partner_name: String) -> Result<Vec<Offer>, Status> {
        if !self.partner_check(partner_name.clone()) {
            return Err(Status::BadRequest);
        }

        let filter = doc! {"partner_name": partner_name};
        let iter = self.col_offers.find(filter, None);

        return match iter {
            Ok(iter) => Ok(iter.map(|temp| temp.unwrap()).collect()),
            Err(_) => Err(Status::BadRequest),
        };
    }

    pub fn buy_offer(&self, user_id: String, offer_id: String) -> Result<Status, Status> {
        return match self.retrieve_logged_user(user_id) {
            Some(logged_user) => {
                let filter = doc! {"_id": logged_user};
                match self.col_wallets.find_one(filter.clone(), None) {
                    Err(_) => { Err(Status::InternalServerError) },
                    Ok(expected) => match expected {
                        None => { Err(Status::InternalServerError) },
                        Some(wallet) => match self.retrieve_offer(offer_id.clone()) {
                            None => { Err(Status::InternalServerError) },
                            Some(offer) => {
                                println!("{}", offer.cost);
                                if offer.cost <= wallet.coins && offer.num >= 1 {
                                    let new_doc = doc! {
                                        "$set": {
                                            "coins": (wallet.coins - offer.cost)
                                        },
                                    };
                                    self.col_wallets
                                        .find_one_and_update(filter.clone(), new_doc, None)
                                        .ok();

                                    if offer.num == 1 {
                                        let filter_off = doc! {"_id": ObjectId::parse_str(offer_id.clone()).ok() };
                                        self.col_offers.find_one_and_delete(filter_off, None).ok();
                                    }

                                    let filter = doc! {"_id": ObjectId::parse_str(offer_id).ok() };
                                    let new_doc = doc! {
                                        "$set": {
                                            "num": (offer.num - 1)
                                        },
                                    };

                                    self.col_offers.find_one_and_update(filter, new_doc, None).ok();
                                    return Ok(Status::Ok);
                                }
                                Err(Status::BadRequest)
                            }
                        },
                    },
                }
            }
            None => Err(Status::BadRequest),
        };
    }

    fn partner_check(&self, partner_name: String) -> bool {
        let filter = doc! {"name": partner_name};
        return match self.col_partners.find_one(filter, None) {
            Err(_) => false,
            Ok(expect) => match expect {
                None => false,
                Some(_) => true,
            },
        };
    }

    fn offer_check(&self, partner_name: String, token: String) -> bool {
        let filter = doc! {"name": partner_name};
        return match self.col_partners.find_one(filter, None) {
            Err(_) => true,
            Ok(expected) => match expected {
                None => true,
                Some(partner) => {
                    if partner.token == token {
                        return false;
                    }
                    true
                }
            },
        };
    }

    fn user_check(&self, user_e_mail: String) -> bool {
        let filter = doc! {"e_mail": user_e_mail};
        return match self.col_users.find_one(filter, None) {
            Err(_) => false,
            Ok(expected) => match expected {
                None => false,
                Some(_) => true,
            },
        };
    }

    fn admin_check(&self, admin_e_mail: String) -> bool {
        let filter = doc! {"e_mail": admin_e_mail};
        return match self.col_users.find_one(filter, None) {
            Err(_) => false,
            Ok(expected) => match expected {
                None => false,
                Some(_) => true,
            },
        };
    }

    pub fn get_logged_users(&self) -> Result<Vec<User>, Status> {
        let iter = self.col_logged_users.find(None, None).ok();
        match iter {
            None => return Err(Status::InternalServerError),
            Some(users_cursor) => Ok(users_cursor.map(|temp| temp.unwrap()).collect()),
        }
    }

    fn retrieve_logged_user(&self, user_id: String) -> Option<ObjectId> {
        for user in self.get_logged_users().unwrap() {
            if create_hash(user.e_mail.clone().as_str(), Sha256::default()) == user_id {
                return user.id;
            }
        }
        None
    }

    fn logged_user_check(&self, user_e_mail: String) -> bool {
        let filter = doc! {"e_mail": user_e_mail};
        return match self.col_logged_users.find_one(filter, None) {
            Err(_) => false,
            Ok(expected) => match expected {
                None => false,
                Some(_) => true,
            },
        };
    }

    fn retrieve_offer(&self, offer_id: String) -> Option<Offer> {
        match self.get_offers() {
            Err(_) => None,
            Ok(offers_list) => {
                for offer in offers_list {
                    if offer.id == ObjectId::parse_str(offer_id.clone()).ok() {
                        return Some(offer);
                    }
                }
                None
            }
        }
    }

    pub fn get_wallet(&self, user_id: String) -> Result<Wallet, Status> {
        match self.retrieve_logged_user(user_id) {
            None => { Err(Status::BadRequest) }
            Some(user) => {
                let filter = doc! {"_id": user};
                match self.col_wallets.find_one(filter, None) {
                    Err(_) => { Err(Status::BadRequest) }
                    Ok(expected) => {
                        match expected {
                            None => { Err(Status::BadRequest) }
                            Some(wallet) => {
                                Ok(wallet)
                            }
                        }
                    }
                }
            }
        }
    }

    pub fn register_admin(&self, new_admin: Admin) -> Result<InsertOneResult, Status> {
        if self.admin_check(new_admin.e_mail.clone()) {
            return Err(Status::BadRequest);
        }

        let new_admin_doc = Admin {
            id: new_admin.id,
            name: new_admin.name,
            e_mail: new_admin.e_mail,
            password: new_admin.password,
            secret: new_admin.secret.clone(),
        };

        let admin = self.col_admins
                        .insert_one(new_admin_doc.clone(), None)
                        .ok()
                        .expect("Partner insert error\n");
        Ok(admin)
    }

    pub fn login_as_admin(&self, e_mail: String, pass: String, secret: String) -> Result<Admin, Status> {
        let filter = doc! {"e_mail": e_mail.clone()};
        let admin_details = self.col_admins.find_one(filter, None).ok();

        return match admin_details {
            None => Err(Status::BadRequest),
            Some(admin_detail_unwraped) => match admin_detail_unwraped {
                None => Err(Status::InternalServerError),
                Some(details) => {
                    let pass_hash = create_hash(pass.as_str(), Sha256::default());
                    if details.password != create_hash(pass.as_str(), Sha256::default()) ||
                       details.secret != create_hash(pass_hash.as_str(), Sha256::default()){
                        return Err(Status::BadRequest);
                    }

                    Ok(details)
                },
            },
        };
    }

    pub fn request_pay_admin(&self, payer: String, receiver: String,
                             intent: String, amount: f64, category: String,
                             date: String, hash: String) -> Result<Transaction, Status> {
        if !self.user_check(payer.clone()) || !self.user_check(receiver.clone()) {
            return Err(Status::BadRequest);
        }
        let payer_clone = payer.clone();
        let receiver_clone = receiver.clone();

        let transaction = Transaction {
            payer: payer_clone,
            receiver: receiver_clone,
            intent,
            amount,
            category,
            date,
            blockchain_hash: hash,
        };

        let payer_filter = doc! {"e_mail": payer.clone()};
        let receiver_filter = doc! {"e_mail": receiver.clone()};

        let payer = self.col_users.find_one(payer_filter, None).ok().unwrap().unwrap();
        let receiver = self.col_users.find_one(receiver_filter, None).ok().unwrap().unwrap();

        let payer_wallet_doc = doc! {"_id": payer.id.unwrap()};
        let receiver_wallet_doc = doc! {"_id": receiver.id.unwrap()};

        let mut payer_wallet = self.col_wallets.find_one(payer_wallet_doc.clone(), None).ok().unwrap().unwrap();
        let mut receiver_wallet = self.col_wallets.find_one(receiver_wallet_doc.clone(), None).ok().unwrap().unwrap();

        payer_wallet.transactions.push(transaction.clone());
        receiver_wallet.transactions.push(transaction.clone());

        let payer_transaction_array = doc! {
            "$set": {
                "transactions": bson::to_bson(&payer_wallet.transactions).ok()
            }
        };
        let receiver_transaction_array = doc! {
            "$set": {
                "transactions": bson::to_bson(&receiver_wallet.transactions).ok()
            }
        };

        self.col_wallets.find_one_and_update(payer_wallet_doc, payer_transaction_array, None).ok();
        self.col_wallets.find_one_and_update(receiver_wallet_doc, receiver_transaction_array, None).ok();

        Ok(transaction)
    }
}
