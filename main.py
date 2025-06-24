import requests
import os

def movie_to_markdown(title, api_key):
    url = f"http://www.omdbapi.com/?t={title}&apikey={api_key}"
    response = requests.get(url)
    data = response.json()

    if data['Response'] == 'False':
        return f"# Movie not found: {title}"

    markdown = f"""# {data['Title']} ({data['Year']})
**IMDb Rating:** {data['imdbRating']}  
**Genre:** {data['Genre']}  
**Director:** {data['Director']}  
**Actors:** {data['Actors']}  
**Plot:** {data['Plot']}  
**Language:** {data['Language']}  
**Runtime:** {data['Runtime']}  
**Released:** {data['Released']}  
**IMDb Link:** [View on IMDb](https://www.imdb.com/title/{data['imdbID']}/)
"""
    return markdown

def generate_markdown_files(movie_titles, api_key, output_dir="markdown_movies"):
    os.makedirs(output_dir, exist_ok=True)
    
    for title in movie_titles:
        print(f"Fetching data for: {title}")
        md = movie_to_markdown(title, api_key)
        filename = os.path.join(output_dir, f"{title.replace(' ', '_')}.md")
        with open(filename, "w", encoding="utf-8") as f:
            f.write(md)
        print(f"Saved: {filename}")

# === Example usage ===
api_key = "13c09666" 
movies = [
    "Inception",
    "The Matrix",
    "Parasite",
    "The Godfather",
    "Interstellar",
    "Iron Man"
]

generate_markdown_files(movies, api_key)
