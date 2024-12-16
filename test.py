import random

def generate_terrain(width, height, density=0.5):
    """
    Generate a 2D bitmap array of 1s and 0s representing terrain.

    Parameters:
    - width: The width of the terrain (in terms of number of cells).
    - height: The height of the terrain (in terms of number of cells).
    - density: The probability (0 to 1) of a cell being solid (1). Default is 0.5.

    Returns:
    - A 2D list representing the terrain bitmap.
    """
    bitmap = []
    for y in range(height):
        row = []
        for x in range(width):
            # Randomly set 1 (solid terrain) or 0 (empty space) based on density
            row.append(1 if random.random() < density else 0)
        bitmap.append(row)
    return bitmap

# Example: Generate a terrain map with a 100x50 grid and 50% density
width = 20
height = 50
density = 0.5
terrain_bitmap = generate_terrain(width, height, density)

# Print the generated terrain bitmap (for debugging or visualization)
for x in terrain_bitmap:
    print(x)
