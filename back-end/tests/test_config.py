import json

def test_empty_configurations(client):
    res = client.get('/configurations')
    assert res.status_code == 200
    expected = []
    assert expected == json.loads(res.get_data(as_text=True))


def test_create_config(client):
    # first we create a feed to connect the config to.
    feed_data = {
        "name": "test",
        "description": "description",
        "location": "eindhoven",
        "feed_type": "ip_cam",
        "url": "http://test.mp4",
        "detection_types": ['Person', 'Car']
    }

    response = client.post(
        "/feeds",
        data=json.dumps(feed_data),
        headers={"Content-Type": "application/json"},
    )
    response.status_code == 200

    config_data = {
        "feed_id": "1",
        "name": "configuration",
        "resolution": "8k Ultra HD"
    }
    response = client.post(
        "/configurations",
        data=json.dumps(config_data),
        headers={"Content-Type": "application/json"},
    )
    response.status_code == 200

def test_update_config(client):
    config_data = {
        "feed_id": "1",
        "name": "TEST CONFIGURATION",
        "resolution": "8k Ultra HD",
        "detection_types": ['Person', 'Car']
    }

    response = client.put(
        "/configurations/1",
        data=json.dumps(config_data),
        headers={"Content-Type": "application/json"},
    )
    response.status_code == 200
    expected = {'detections': [{'detectionType': 'Person', 'id': 1}, {'detectionType': 'Car', 'id': 2}], 'id': 1, 'feed': 1, 'name': 'TEST CONFIGURATION', 'drawables': None, 'resolution': '8k Ultra HD'}
    assert expected == json.loads(response.get_data(as_text=True))


def test_delete_feed(client):
    response = client.delete('/configurations/1')
    assert response.status_code == 204
    response = client.delete('/feeds/1')
    assert response.status_code == 204


