import requests
from bs4 import BeautifulSoup
import csv

class IMDBScriptFetcher:
    def __init__(self, base_url: str):
        self.base_url = base_url
        self.script_links = []

    def fetch_script_links(self):
        """Fetches the script links from the listing page, including year and writers."""
        try:
            response = requests.get(self.base_url)
            response.raise_for_status()  # Raise an error for bad responses
            
            soup = BeautifulSoup(response.content, 'html.parser')

            for p in soup.find_all('p'):
                a_tag = p.find('a') 
                if a_tag:
                    script_name = a_tag.get_text(strip=True)
                    
                    # Format the script URL with hyphens instead of spaces
                    formatted_name = script_name.replace(" ", "-")
                    script_url = f"https://imsdb.com/scripts/{formatted_name}.html"  # Construct the script URL
                    
                    # Get the year information from <p>
                    year_info = p.get_text(strip=True)  
                    year = year_info.split('(')[-1].split(')')[0] if '(' in year_info else "Unknown"

                    # Get the writers from the <i> tag
                    writer_tag = p.find('i')
                    writers = writer_tag.get_text(strip=True) if writer_tag else "Unknown"

                    self.script_links.append((script_name, script_url, year, writers))
            print(f"Total scripts found: {len(self.script_links)}")

        except requests.exceptions.RequestException as e:
            print(f"Error fetching the script list: {e}")

    def fetch_script_content(self, script_url):
        """Fetches script content from the individual script page, specifically within <pre> tags."""
        try:
            response = requests.get(script_url)
            response.raise_for_status()  # Raise an error for bad responses
            
            soup = BeautifulSoup(response.content, 'html.parser')

            # Find the script content within <pre> tags
            script_content_elem = soup.find('pre')
            if script_content_elem:
                script_content = script_content_elem.get_text("\n", strip=True)
                return script_content
            else:
                print(f"Script content not found in <pre> tags for {script_url}")
                return None

        except requests.exceptions.RequestException as e:
            print(f"Error fetching script content from {script_url}: {e}")
            return None

    def save_to_csv(self, filename='../source_data/scripts_data.csv'):
        """Saves the script data to a CSV file."""
        with open(filename, mode='w', newline='', encoding='utf-8') as csv_file:
            fieldnames = ['movie_name', 'year', 'writers', 'script_content']
            writer = csv.DictWriter(csv_file, fieldnames=fieldnames)

            writer.writeheader()
            for script_name, script_url, year, writers in self.script_links:
                script_content = self.fetch_script_content(script_url)
                if script_content:
                    writer.writerow({
                        'movie_name': script_name,
                        'year': year[:-6],
                        'writers': writers[11:],
                        'script_content': script_content
                    })
                    print(f"Saved: {script_name} ({year})")
                else:
                    print(f"Skipping {script_name} due to missing content.")

if __name__ == "__main__":
    scripts_list_url = "https://imsdb.com/all-scripts.html"
    
    fetcher = IMDBScriptFetcher(scripts_list_url)
    fetcher.fetch_script_links()
    fetcher.save_to_csv()  # This will fetch each script and save it to CSV
