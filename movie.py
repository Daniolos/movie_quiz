from typing import Optional


class Movie:
    def __init__(self, details: dict) -> None:
        self.title = details.get("title")
        self.year = details.get("year")
        self.description = details.get("description")
        self.type = details.get("type")
        self.streams = details.get("streams")
        self.keywords = details.get("keywords")
        self.api_used = details.get("apiused")

    @property
    def remaining_api_calls(self) -> Optional[int]:
        if not isinstance(self.api_used, int):
            return
        return 100 - self.api_used if 0 <= self.api_used < 100 else 0

    def __eq__(self, __o: object) -> bool:
        if not isinstance(self, __o.__class__):
            return False

        for (_, value_1), (_, value_2) in zip(
            self.__dict__.items(), __o.__dict__.items()
        ):
            if value_1 != value_2:
                return False

        return True
