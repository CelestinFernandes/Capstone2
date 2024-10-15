import pandas as pd
from imdb import IMDb
 
ia = IMDb()

csv_file_path = 'model/source_data/scripts_data.csv'
df = pd.read_csv(csv_file_path)
movie_names = df['movie_name']

def get_movie_data(movie_name):
    movies = ia.search_movie(movie_name)
    if len(movies) == 0:
        print(movie_name, "not found")
        return None  # No movie found
    
    movie = movies[0]
    ia.update(movie) 
    
    movie_data = {
            'title': movie.get('title'),
            'year': movie.get('year'),
            'genres': ', '.join(movie.get('genres', [])),
            'director': ', '.join([director['name'] for director in movie.get('directors', [])]),
            'writers': ', '.join([writer.get('name', 'Unknown') for writer in movie.get('writers', [])]),  # Updated to safely access 'name'
            'cast': ', '.join([actor['name'] for actor in movie.get('cast', [])[ :10]]),  # Top 10 cast members
            'runtime': movie.get('runtime', [None])[0],  # Get first runtime if list
            'rating': movie.get('rating', None),
            'votes': movie.get('votes', None),
            'plot': ' '.join(movie.get('plot', [])),
            'keywords': ', '.join(movie.get('keywords', [])),
            'languages': ', '.join(movie.get('languages', [])),
            'production_company': ', '.join([company['name'] for company in movie.get('production companies', [])]),
            'box_office': movie.get('box office', {}).get('Cumulative Worldwide Gross', None),
            'awards': ', '.join(movie.get('awards', [])),
        }
    
    return movie_data

movie_data_list = []
for movie_name in movie_names:
    movie_data = get_movie_data(movie_name)
    if movie_data:
        movie_data_list.append(movie_data)
    else:
        movie_data_list.append({key: None for key in ['genres', 'director', 'cast', 'runtime', 'rating', 'votes', 'plot', 'keywords', 'languages', 'production_company', 'box_office', 'awards']})

movie_data_df = pd.DataFrame(movie_data_list)
new_df = pd.concat([df, movie_data_df], axis=1)

output_file_path = 'model/source_data/scripts_data_updated.csv'
new_df.to_csv(output_file_path, index=False)

new_df.head()
