import json

def test_empty_feeds(client):
    res = client.get('/feeds')
    assert res.status_code == 200
    expected = []
    assert expected == json.loads(res.get_data(as_text=True))


def test_create_feed(client):
    data = {
        "name": "test",
        "description": "description",
        "location": "eindhoven",
        "feed_type": "ip_cam",
        "url": "http://test.mp4"
    }

    response = client.post(
        "/feeds",
        data=json.dumps(data),
        headers={"Content-Type": "application/json"},
    )
    response.status_code == 200

def test_update_feed(client):
    data = {
        "name": "TEST UPDATE",
        "description": "UPDATED DESCRIPTION",
        "location": "eindhoven",
        "feed_type": "ip_cam",
        "url": "http://test.mp4"
    }

    response = client.put(
        "/feeds/1",
        data=json.dumps(data),
        headers={"Content-Type": "application/json"},
    )
    response.status_code == 200
    expected = {'description': 'UPDATED DESCRIPTION', 'feed_type': 2, 'url': 'http://test.mp4', 'name': 'TEST UPDATE', 'active': False, 'location': 'eindhoven', 'configuration': None, 'id': 1}
    assert expected == json.loads(response.get_data(as_text=True))


def test_delete_feed(client):
    response = client.delete('/feeds/1')
    assert response.status_code == 204


