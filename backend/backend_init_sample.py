import backend_create_database
import backend_create_tables
from backend_input_data import fill_sample_users, fill_athletes


if (__name__ == "__main__"):
    fill_athletes(20)
    fill_sample_users()
