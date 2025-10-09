import pandas as pd

# Load the dataset
file = r"C:\Users\acer\Desktop\loan_approval_dataset.csv"
df = pd.read_csv(file)

# Display the first 5 rows (default)
print(df.head())

# Check for missing values
print("\nMissing values in each column:")
print(df.isnull().sum())

# Fill missing values with mean for numerical columns
numerical_cols = df.select_dtypes(include=['number']).columns
df[numerical_cols] = df[numerical_cols].fillna(df[numerical_cols].mean())

# Fill missing values with mode for categorical columns
categorical_cols = df.select_dtypes(include=['object']).columns
for col in categorical_cols:
    df[col] = df[col].fillna(df[col].mode()[0])

# Verify no missing values remain
print("\nMissing values after filling:")
print(df.isnull().sum())

# Remove duplicates
df = df.drop_duplicates()

# Display basic statistics
print("\nBasic statistics:")
print(df.describe())

# Check data types
print("\nData types:")
print(df.dtypes)

# Convert categorical columns to category type if needed
for col in categorical_cols:
    df[col] = df[col].astype('category')

# Display the shape of the dataset
print("\nShape of the dataset:")
print(df.shape)

# Save the cleaned dataset
df.to_csv(r"C:\Users\acer\Desktop\cleaned_loan_approval_dataset.csv", index=False)

print("\nCleaned dataset saved successfully!")
