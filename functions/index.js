const functions = require("firebase-functions/v2");
require("date");

const { initializeApp } = require("firebase-admin/app");
const { getFirestore } = require("firebase-admin/firestore");
initializeApp();
const db = getFirestore();

// Media wallet meta tag handling
const GenerateMediaWalletIndex = require("./MediaWallet.cjs");
const create_previewable_link_v2 = functions
  .https
  .onRequest(async (req, res) => {
    await GenerateMediaWalletIndex(db, req, res);
  });

// Eluv.io meta tag handling
const GeneratePocketIndex = require("./PocketTV.cjs");
const pocket_rewriter = functions
  .https
  .onRequest(async (req, res) => {
    await GeneratePocketIndex(db, req, res);
  });

// Eluv.io meta tag handling
const GenerateEluvioIndex = require("./EluvioSite.cjs");
const create_index_html_v2 = functions
  .https
  .onRequest(async (req, res) => {
    await GenerateEluvioIndex(db, req, res);
  });

exports.create_previewable_link_v2 = create_previewable_link_v2;
exports.create_index_html_v2 = create_index_html_v2;
exports.pocket_rewriter = pocket_rewriter;

