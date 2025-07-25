import pandas as pd
import sqlite3

movies_data = pd.read_csv("final_data.csv")
movies_data = movies_data.fillna('Unknown')

movies_data = movies_data[
    (movies_data['Director'] != 'Unknown') &
    (movies_data['Description'] != 'Unknown') &
    (movies_data['Actors'] != 'Unknown') &
    (movies_data['Genres'] != 'Unknown') &
    (movies_data['DatePublished'] != 'Unknown')
]

# print(movies_data.iloc[3])

conn = sqlite3.connect("termproject.db")
cursor = conn.cursor()

def insertPerson(name):
    cursor.execute("SELECT id FROM people WHERE name = ?", (name,))
    result = cursor.fetchone()
    if result:
        # print("returning id: " , result[0], " for ", name)
        return result[0]
    else:
        cursor.execute("INSERT INTO people (name) VALUES (?)", (name,))
        conn.commit()
        return cursor.lastrowid
    
def insert_movie(url, poster_url, title, year, duration, rating, description):
    cursor.execute("""
            INSERT INTO movies (imdb_url, poster_url, title, year, duration, rating, description) 
                   VALUES (?, ?, ?, ?, ?, ?, ?)
                   """, (url, poster_url, title, year, duration, rating, description))
    conn.commit()
    return cursor.lastrowid

def insert_genre(name):
    cursor.execute("SELECT id FROM genres WHERE name = ?", (name,))
    result = cursor.fetchone()

    if result:
        return result[0]
    else:
        cursor.execute("INSERT INTO genres (name) VALUES (?)", (name,))
        conn.commit()
        return cursor.lastrowid
    
def insert_movie_genre(movie_id, genre_id):
    cursor.execute("""
                INSERT INTO movie_genre (movie_id, genre_id) VALUES (?, ?)""",
                (movie_id, genre_id))
    conn.commit()


def insertDirector(movie_id, director_id):
    cursor.execute("INSERT INTO directors (director_id, movie_id) VALUES (?, ?)", (director_id, movie_id))
    conn.commit()

def starsIn(person_id, movie_id):
    # Check if the combination already exists
    cursor.execute('''
                   SELECT 1 FROM stars_in
                   WHERE person_id = ? AND movie_id = ?
                   ''', (person_id, movie_id))
    result = cursor.fetchone()  # Fetch one row of the result

    if result is None:  # If no row was found
        cursor.execute('''
                       INSERT INTO stars_in (person_id, movie_id) 
                       VALUES (?, ?)''', (person_id, movie_id))
     
    else:
        print("Record already exists.")

def director_movie(director_id, movie_id):
    # Check if the combination already exists
    cursor.execute('''
                   SELECT 1 FROM director_for
                   WHERE director_id = ? AND movie_id = ?
                   ''', (director_id, movie_id))
    result = cursor.fetchone()  # Fetch one row of the result

    if result is None:  # If no row was found
        cursor.execute('''
                       INSERT INTO director_for (director_id, movie_id) 
                       VALUES (?, ?)''', (director_id, movie_id))
 

for _, row in movies_data.iterrows():
    url = row["url"]
    poster = row["PosterLink"]
    title = row["Name"]
    year = row["DatePublished"].split("-")[0]
    duration = row["duration"]
    genres = row["Genres"].split(",")
    rating = row["RatingValue"]
    directors = row["Director"].split(",")
    actors = row['Actors'].split(",")
    description = row["Description"]

    movie_id = insert_movie(url, poster, title, year, duration, rating, description)

    for director in directors:
        directorID = insertPerson(director.strip())
        director_movie(directorID, movie_id)
    
    for actor in actors:
        actorID = insertPerson(actor.strip())
        starsIn(actorID, movie_id)

    for genre in genres:
        genreID = insert_genre(genre.strip())
        insert_movie_genre(movie_id, genreID)

