from dataclasses import dataclass, field
import unittest
from unittest.mock import MagicMock, patch
import movie_quiz as mq
from movie import Movie


def get_movie_mock(t=True, d=True, k=True):
    return Movie({"title": t, "description": d, "keywords": k})


@dataclass
class ResponceMock:
    status_code: int
    text: str = field(default="", init=False)


class TestMovieQuiz(unittest.TestCase):
    def test_get_random_movie_id_returns_movie_id(self):

        id_by_movie = {"Titanic": "1234"}

        result = mq.get_random_movie_id(id_by_movie)

        self.assertEqual(result, "1234")

    @patch("movie_quiz.MDB_LIST_HEADERS", "header")
    @patch("movie_quiz.MDB_LIST_URL", "url")
    @patch("requests.request")
    def test_get_response_by_movie_id(self, request_mock: MagicMock):

        mq.get_response_by_movie_id("1234")

        request_mock.assert_called_once_with(
            "GET", "url", headers="header", params={"i": "1234"}
        )

    def test_get_status_code_info_returns_info(self):

        result = mq.get_status_code_info(438)

        self.assertEqual(
            result,
            "Client error. There’s something wrong with the way the browser asked for the page.",
        )

    def test_set_movie(self):
        string_dict = '{"title": "Jaws"}'

        result = mq.set_movie(string_dict)

        self.assertEqual(result, Movie({"title": "Jaws"}))

    @patch("movie_quiz.SKIPPABLE", True)
    @patch("movie_quiz.KEYWORD_TTS", True)
    @patch("movie_quiz.MAX_KEYWORDS", 5)
    @patch("movie_quiz.print")
    @patch("movie_quiz.time.sleep")
    @patch("movie_quiz.input", return_value="continue")
    @patch("movie_quiz.convert_text_to_speech")
    @patch("movie_quiz.human_print")
    @patch("movie_quiz.get_translation", side_effect=lambda x: x)
    @patch("random.shuffle")
    def test_run_keyword_quiz(
        self,
        shuffle_mock: MagicMock,
        get_translation_mock: MagicMock,
        human_print_mock: MagicMock,
        convert_text_to_speech_mock: MagicMock,
        input_mock: MagicMock,
        sleep_mock: MagicMock,
        print_mock: MagicMock,
    ):

        keywords = [{"name": "keyword"}, {"name": "keyword"}]

        mq.run_keyword_quiz(keywords)

        shuffle_mock.assert_called_once()

        self.assertEqual(get_translation_mock.call_count, 2)
        self.assertEqual(human_print_mock.call_count, 2)

        self.assertEqual(convert_text_to_speech_mock.call_count, 2)

        self.assertEqual(input_mock.call_count, 2)

        sleep_mock.assert_not_called()
        print_mock.assert_not_called()

    @patch("movie_quiz.SKIPPABLE", False)
    @patch("movie_quiz.KEYWORD_TTS", False)
    @patch("movie_quiz.MAX_KEYWORDS", 5)
    @patch("movie_quiz.print")
    @patch("movie_quiz.time.sleep")
    @patch("movie_quiz.input", return_value="continue")
    @patch("movie_quiz.convert_text_to_speech")
    @patch("movie_quiz.human_print")
    @patch("movie_quiz.get_translation", side_effect=lambda x: x)
    @patch("random.shuffle")
    def test_run_keyword_quiz_bool_constants_set_to_false(
        self,
        shuffle_mock: MagicMock,
        get_translation_mock: MagicMock,
        human_print_mock: MagicMock,
        convert_text_to_speech_mock: MagicMock,
        input_mock: MagicMock,
        sleep_mock: MagicMock,
        print_mock: MagicMock,
    ):

        keywords = [{"name": "keyword"}, {"name": "keyword"}]

        mq.run_keyword_quiz(keywords)

        shuffle_mock.assert_called_once()

        self.assertEqual(get_translation_mock.call_count, 2)
        self.assertEqual(human_print_mock.call_count, 2)

        convert_text_to_speech_mock.assert_not_called()

        input_mock.assert_not_called()

        self.assertEqual(sleep_mock.call_count, 2)
        self.assertEqual(print_mock.call_count, 2)

    @patch("movie_quiz.SKIPPABLE", True)
    @patch("movie_quiz.KEYWORD_TTS", True)
    @patch("movie_quiz.MAX_KEYWORDS", 5)
    @patch("movie_quiz.print")
    @patch("movie_quiz.time.sleep")
    @patch("movie_quiz.input", return_value="continue")
    @patch("movie_quiz.convert_text_to_speech")
    @patch("movie_quiz.human_print")
    @patch("movie_quiz.get_translation", side_effect=lambda x: x)
    @patch("random.shuffle")
    def test_run_keyword_quiz_skips_if_keyword_contains_hyphen(
        self,
        shuffle_mock: MagicMock,
        get_translation_mock: MagicMock,
        human_print_mock: MagicMock,
        convert_text_to_speech_mock: MagicMock,
        input_mock: MagicMock,
        sleep_mock: MagicMock,
        print_mock: MagicMock,
    ):

        keywords = [{"name": "keyword"}, {"name": "key-word"}, {"name": "keyword"}]

        mq.run_keyword_quiz(keywords)

        self.assertEqual(human_print_mock.call_count, 2)

    @patch("movie_quiz.SKIPPABLE", True)
    @patch("movie_quiz.KEYWORD_TTS", True)
    @patch("movie_quiz.MAX_KEYWORDS", 1)
    @patch("movie_quiz.print")
    @patch("movie_quiz.time.sleep")
    @patch("movie_quiz.input", return_value="continue")
    @patch("movie_quiz.convert_text_to_speech")
    @patch("movie_quiz.human_print")
    @patch("movie_quiz.get_translation", side_effect=lambda x: x)
    @patch("random.shuffle")
    def test_run_keyword_quiz_does_not_exceed_max_keywords(
        self,
        shuffle_mock: MagicMock,
        get_translation_mock: MagicMock,
        human_print_mock: MagicMock,
        convert_text_to_speech_mock: MagicMock,
        input_mock: MagicMock,
        sleep_mock: MagicMock,
        print_mock: MagicMock,
    ):

        keywords = [{"name": "keyword"} for i in range(3)]

        mq.run_keyword_quiz(keywords)

        human_print_mock.assert_called_once()

    @patch("movie_quiz.SKIPPABLE", True)
    @patch("movie_quiz.KEYWORD_TTS", True)
    @patch("movie_quiz.MAX_KEYWORDS", 5)
    @patch("movie_quiz.print")
    @patch("movie_quiz.time.sleep")
    @patch("movie_quiz.input", return_value="skip")
    @patch("movie_quiz.convert_text_to_speech")
    @patch("movie_quiz.human_print")
    @patch("movie_quiz.get_translation", side_effect=lambda x: x)
    @patch("random.shuffle")
    def test_run_keyword_quiz_ends_if_input_is_skip(
        self,
        shuffle_mock: MagicMock,
        get_translation_mock: MagicMock,
        human_print_mock: MagicMock,
        convert_text_to_speech_mock: MagicMock,
        input_mock: MagicMock,
        sleep_mock: MagicMock,
        print_mock: MagicMock,
    ):

        keywords = [{"name": "keyword"} for i in range(3)]

        mq.run_keyword_quiz(keywords)

        human_print_mock.assert_called_once()

    @patch("movie_quiz.DESCRIPTION_TTS", True)
    @patch("movie_quiz.DESCRIPTION_HUMAN_PRINT", True)
    @patch("movie_quiz.convert_text_to_speech")
    @patch("movie_quiz.human_print")
    @patch("movie_quiz.get_translation", side_effect=lambda x: x)
    def test_show_movie_description(
        self,
        get_translation_mock: MagicMock,
        human_print_mock: MagicMock,
        convert_text_to_speech_mock: MagicMock,
    ):

        mq.show_movie_description("description")

        self.assertEqual(get_translation_mock.call_count, 2)
        self.assertEqual(human_print_mock.call_count, 2)
        self.assertEqual(convert_text_to_speech_mock.call_count, 2)

    @patch("movie_quiz.DESCRIPTION_TTS", False)
    @patch("movie_quiz.DESCRIPTION_HUMAN_PRINT", True)
    @patch("movie_quiz.convert_text_to_speech")
    @patch("movie_quiz.human_print")
    @patch("movie_quiz.get_translation", side_effect=lambda x: x)
    def test_show_movie_description_title_tts_set_to_false(
        self,
        get_translation_mock: MagicMock,
        human_print_mock: MagicMock,
        convert_text_to_speech_mock: MagicMock,
    ):

        mq.show_movie_description("description")

        self.assertEqual(get_translation_mock.call_count, 2)
        self.assertEqual(human_print_mock.call_count, 2)
        convert_text_to_speech_mock.assert_not_called()

    @patch("movie_quiz.TITLE_TTS", True)
    @patch("movie_quiz.convert_text_to_speech")
    @patch("movie_quiz.human_print")
    @patch("movie_quiz.get_translation", side_effect=lambda x: x)
    def test_show_movie_title(
        self,
        get_translation_mock: MagicMock,
        human_print_mock: MagicMock,
        convert_text_to_speech_mock: MagicMock,
    ):

        mq.show_movie_title("description")

        self.assertEqual(get_translation_mock.call_count, 1)
        self.assertEqual(human_print_mock.call_count, 2)
        self.assertEqual(convert_text_to_speech_mock.call_count, 2)

    @patch("movie_quiz.TITLE_TTS", False)
    @patch("movie_quiz.convert_text_to_speech")
    @patch("movie_quiz.human_print")
    @patch("movie_quiz.get_translation", side_effect=lambda x: x)
    def test_show_movie_title_description_tts_set_to_false(
        self,
        get_translation_mock: MagicMock,
        human_print_mock: MagicMock,
        convert_text_to_speech_mock: MagicMock,
    ):

        mq.show_movie_title("description")

        self.assertEqual(get_translation_mock.call_count, 1)
        self.assertEqual(human_print_mock.call_count, 2)
        convert_text_to_speech_mock.assert_not_called()

    @patch("deep_translator.GoogleTranslator.translate", return_value="translation")
    def test_get_translation_in_english(self, translate_mock):

        result = mq.get_translation("text", "en")

        self.assertEqual(result, "text")

    @patch("deep_translator.GoogleTranslator.translate", return_value="translation")
    def test_get_translation_not_in_english(self, translate_mock):

        result = mq.get_translation("text", "de")

        self.assertEqual(result, "translation")

    @patch("movie_quiz.LANGUAGE", "de")
    @patch("deep_translator.GoogleTranslator.translate", return_value="translation")
    def test_get_translation_with_dictionary_in_german(self, translate_mock):

        result = mq.get_translation_with_dictionary(
            "text", {"text": "translation_dict"}
        )

        self.assertEqual(result, "translation_dict")

    @patch("movie_quiz.LANGUAGE", "en")
    @patch("deep_translator.GoogleTranslator.translate", return_value="translation")
    def test_get_translation_with_dictionary_in_english(self, translate_mock):

        result = mq.get_translation_with_dictionary(
            "text", {"text": "translation_dict"}
        )

        self.assertEqual(result, "text")

    @patch("movie_quiz.LANGUAGE", "es")
    @patch("deep_translator.GoogleTranslator.translate", return_value="translation")
    def test_get_translation_with_dictionary_in_another_language(self, translate_mock):

        result = mq.get_translation_with_dictionary(
            "text", {"text": "translation_dict"}
        )

        self.assertEqual(result, "translation")

    @patch("time.sleep")
    @patch("random.random", return_value=1.0)
    @patch("movie_quiz.print")
    def test_human_print_called_correcctly(
        self, print_mock: MagicMock, random_mock: MagicMock, sleep_mock: MagicMock
    ):

        mq.human_print("text", 60)

        self.assertEqual(print_mock.call_count, len("text") + 1)
        self.assertEqual(sleep_mock.call_count, len("text"))

    @patch("time.sleep")
    @patch("random.random", return_value=1.0)
    @patch("movie_quiz.print")
    def test_human_print_called_with(
        self, print_mock: MagicMock, random_mock: MagicMock, sleep_mock: MagicMock
    ):

        mq.human_print("a", 60)

        sleep_mock.assert_called_once_with(1.0 * 10.0 / 60)

    @patch("movie_quiz.TTS_LANGUAGE", "de")
    @patch("movie_quiz.LANGUAGE", "en")
    @patch("movie_quiz.TTS", True)
    @patch("movie_quiz.print")
    @patch("os.remove")
    @patch("os.path.exists", return_value=True)
    @patch("movie_quiz.playsound")
    @patch("gtts.gTTS.save")
    @patch("gtts.gTTS")
    @patch("movie_quiz.get_translation", side_effects=lambda x, y: x)
    def test_convert_text_to_speech(
        self,
        get_translation_mock: MagicMock,
        gtts_mock: MagicMock,
        save_mock: MagicMock,
        playsound_mock: MagicMock,
        exists_mock: MagicMock,
        remove_mock: MagicMock,
        print_mock: MagicMock,
    ):
        mq.convert_text_to_speech("text", "text_translated")

        get_translation_mock.assert_called_once()
        gtts_mock.assert_called_once()
        save_mock.assert_not_called()
        playsound_mock.assert_called_once()
        exists_mock.assert_called_once()
        remove_mock.assert_called_once()
        print_mock.assert_not_called()

    @patch("movie_quiz.TTS_LANGUAGE", "de")
    @patch("movie_quiz.LANGUAGE", "en")
    @patch("movie_quiz.TTS", True)
    @patch("movie_quiz.print")
    @patch("os.remove")
    @patch("os.path.exists", return_value=False)
    @patch("movie_quiz.playsound")
    @patch("gtts.gTTS.save")
    @patch("gtts.gTTS")
    @patch("movie_quiz.get_translation", side_effects=lambda x, y: x)
    def test_convert_text_to_speech_handle_remove_problem(
        self,
        get_translation_mock: MagicMock,
        gtts_mock: MagicMock,
        save_mock: MagicMock,
        playsound_mock: MagicMock,
        exists_mock: MagicMock,
        remove_mock: MagicMock,
        print_mock: MagicMock,
    ):
        mq.convert_text_to_speech("text", "text_translated")

        get_translation_mock.assert_called_once()
        gtts_mock.assert_called_once()
        save_mock.assert_not_called()
        playsound_mock.assert_called_once()
        exists_mock.assert_called_once()
        remove_mock.assert_not_called()
        print_mock.assert_called_once()

    @patch("movie_quiz.TTS_LANGUAGE", "en")
    @patch("movie_quiz.TTS", False)
    @patch("movie_quiz.print")
    @patch("os.remove")
    @patch("os.path.exists", return_value=True)
    @patch("movie_quiz.playsound")
    @patch("gtts.gTTS.save")
    @patch("gtts.gTTS")
    @patch("movie_quiz.get_translation", side_effects=lambda x, y: x)
    def test_convert_text_to_speech_does_nothing_if_tts_is_set_to_false(
        self,
        get_translation_mock: MagicMock,
        gtts_mock: MagicMock,
        save_mock: MagicMock,
        playsound_mock: MagicMock,
        exists_mock: MagicMock,
        remove_mock: MagicMock,
        print_mock: MagicMock,
    ):
        mq.convert_text_to_speech("text", "text_translated")

        get_translation_mock.assert_not_called()
        gtts_mock.assert_not_called()
        save_mock.assert_not_called()
        playsound_mock.assert_not_called()
        exists_mock.assert_not_called()
        remove_mock.assert_not_called()
        print_mock.assert_not_called()
