import math
import os
import openai

import tiktoken


def split_string_into_n_parts(s, n):
    length = len(s)
    part_length = (length + n - 1) // n
    parts = []
    for i in range(n - 1):
        start_pos = i * part_length
        end_pos = start_pos + part_length
        substrings = s[start_pos:end_pos].split('||')
        nearest_index = min(range(len(substrings)),
                            key=lambda i: abs(part_length - s.find(substrings[i], start_pos)))
        parts.append('||'.join(substrings[:nearest_index + 1]))
        s = s[start_pos + len(parts[-1]):].lstrip('||')
    parts.append(s)
    return parts


def num_tokens_from_string(string: str) -> int:
    """Returns the number of tokens in a text string."""
    encoding = tiktoken.get_encoding("cl100k_base")
    encoding = tiktoken.encoding_for_model("gpt-3.5-turbo")
    num_tokens = len(encoding.encode(string))
    return num_tokens


class InsightsOperations:
    def __init__(self):
        openai.api_key = "YOUR OPENAI API KEY (DO NOT MAKE THIS KEY PUBLIC EVER)"
        self.messages = []

    def addToMessages(self, role, content):
        self.messages.append({"role": role, "content": content})

    def removeLastTheme(self):
        self.messages = self.messages[:-2]

    def getThemes(self, notes):
        tokens = num_tokens_from_string(notes)
        cuts = math.ceil(tokens / 4096);

        notelist = []
        themes = ""
        if cuts > 1:
            notelist = split_string_into_n_parts(notes, cuts)
            print(notes)
        else:
            notelist.append(notes)

        for note in notelist:
            self.addToMessages("user", note)
            self.addToMessages("user",
                               "Can you tell me the common themes/insights in the notes? Can you also attach quotes "
                               "to every insights? Every theme should start with 'Theme:' with bullet sub points. "
                               "Every attached quote should end with '|' and then the sentiment analysis value for it "
                               "should be added, you will write -1 for negative sentiment, 0 for neutral sentiment "
                               "and +1 for positive sentiment. Only append the integer number values. Do not greet my "
                               "or anything. Just reply with what I've asked for.")
            themes += self.contactGPT()
            self.removeLastTheme()
        return themes

    def contactGPT(self):
        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo-0613",
            messages=self.messages
        )
        return response.choices[0].message.content

