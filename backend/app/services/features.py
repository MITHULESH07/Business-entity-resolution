from difflib import SequenceMatcher

def similarity(text1,text2):
    text1 = text1.lower().strip()
    text2 = text2.lower().strip()
    return SequenceMatcher(None,text1,text2).ratio()

def create_features(record1,record2):
    features = {
        "name_similarity":similarity(record1.name,record2.name),
        "address_similarity":similarity(record1.address,record2.address),
        "city_similarity":int(record1.city.lower()==record2.city.lower()),
        "state_similarity":int(record1.state.lower()==record2.state.lower()),
        "zip_match":int(record1.zip_code == record2.zip_code)
    }
    return features
