import unittest
from movie import Movie


class TestMovie(unittest.TestCase):
    def test_remaining_api_calls_(self):
        movie = Movie({"apiused": 60})

        result = movie.remaining_api_calls

        self.assertEqual(result, 40)

    def test_remaining_api_calls_api_used_value_exceeds_100(self):
        movie = Movie({"apiused": 120})

        result = movie.remaining_api_calls

        self.assertEqual(result, 0)

    def test_remaining_api_calls_negative_api_used_value(self):
        movie = Movie({"apiused": -1})

        result = movie.remaining_api_calls

        self.assertEqual(result, 0)

    def test_remaining_api_calls_incorrect_api_used_value(self):
        movie = Movie({"apiused": "50"})

        result = movie.remaining_api_calls

        self.assertEqual(result, None)

    def test_equal_returns_true(self):
        movie_1 = Movie({"title": "Jaws"})
        movie_2 = Movie({"title": "Jaws"})

        result = movie_1 == movie_2

        self.assertTrue(result)

    def test_equal_returns_false_if_wrong_instance(self):
        movie_1 = Movie({"title": "Jaws"})
        movie_2 = 1

        result = movie_1 == movie_2

        self.assertFalse(result)

    def test_equal_returns_false_if_instances_are_different(self):
        movie_1 = Movie({"title": "Jaws"})
        movie_2 = Movie({"title": "Jurassic Park"})

        result = movie_1 == movie_2

        self.assertFalse(result)
