import httpx
from models.chat_models import IntentResult

async def fetch_data(
    resolution: dict,
    token:      str
) -> dict:
    """
    Calls the resolved microservice and returns the raw data.
    The token is forwarded so RLS and role checks still apply.
    """
    if not resolution["needs_fetch"]:
        return {}

    url = resolution["service_url"] + resolution["path"]

    # Append query filters from extracted entities
    params = {}
    entities = resolution.get("entities", {})
    if entities.get("semester"):
        params["semester"] = entities["semester"]

    try:
        async with httpx.AsyncClient(timeout=5.0) as client:
            response = await client.get(
                url,
                headers={ "Authorization": f"Bearer {token}" },
                params=params
            )
            response.raise_for_status()
            body = response.json()
            return body.get("data", {})

    except httpx.TimeoutException:
        return { "error": "Service timeout" }
    except httpx.HTTPStatusError as e:
        return { "error": f"Service returned {e.response.status_code}" }
    except Exception as e:
        return { "error": str(e) }