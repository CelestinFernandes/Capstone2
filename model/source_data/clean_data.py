import pandas as pd

## Preprocessing step - filtering data that had matching title in IMDb and IMSDb
def filter_matching_movies():
    df = pd.read_csv('model/scraped_data/scripts_data_updated.csv')
    
    filtered_df = df[df['movie_name'] == df['title']]
    filtered_df.to_csv('model/scraped_data/scripts_data_filtered.csv', index=False)

    count = len(filtered_df)
    print(f"Total matching records retained: {count}")
    return count

filter_matching_movies()