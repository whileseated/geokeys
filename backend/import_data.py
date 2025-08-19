import pandas as pd
from app import app
from models import db, City

def import_csv_data():
    csv_path = '../us_cities_for_git_sorted.csv'
    
    df = pd.read_csv(csv_path, sep=';', header=None, names=[
        'name', 'county', 'state'
    ])
    
    # Clean the data
    df = df.drop_duplicates(subset=['name', 'state'])
    
    # Filter out invalid states
    valid_states = {
        'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 
        'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 
        'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan', 
        'Minnesota', 'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 
        'New Jersey', 'New Mexico', 'New York', 'North Carolina', 'North Dakota', 'Ohio', 
        'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota', 
        'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington', 'West Virginia', 
        'Wisconsin', 'Wyoming', 'District of Columbia'
    }
    
    # Remove rows with invalid states and filter out 'nan' values
    df = df[df['state'].notna()]  # Remove NaN values
    df = df[df['county'].notna()]  # Remove NaN county values
    df = df[df['county'].astype(str).str.lower() != 'nan']  # Remove 'nan' string values
    df = df[df['state'].str.strip().isin(valid_states)]  # Only keep valid US states
    
    with app.app_context():
        db.create_all()
        
        # Only delete City data, preserve GameScore data
        City.query.delete()
        
        for _, row in df.iterrows():
            city = City(
                name=str(row['name']).strip('"'),
                county=str(row['county']).strip('"'),
                state=str(row['state']).strip('"')
            )
            db.session.add(city)
        
        db.session.commit()
        
        total_cities = City.query.count()
        total_states = db.session.query(City.state).distinct().count()
        
        print(f"Successfully imported {total_cities} cities from {total_states} states")

if __name__ == '__main__':
    import_csv_data()