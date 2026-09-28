import os
import json

import firebase_admin
from firebase_admin import credentials, firestore


if not firebase_admin._apps:

    service_account_json = os.getenv(
        "FIREBASE_SERVICE_ACCOUNT_JSON"
    )

    if service_account_json:

        service_account_info = json.loads(
            service_account_json
        )

        cred = credentials.Certificate(
            service_account_info
        )

    else:

        cred = credentials.Certificate(
            "firebase-service-account.json"
        )

    firebase_admin.initialize_app(cred)


db = firestore.client()