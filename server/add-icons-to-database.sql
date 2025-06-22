-- Add iconName column to career_clusters table
ALTER TABLE career_clusters ADD COLUMN IF NOT EXISTS "iconName" TEXT;

-- Update career clusters with their respective icons
UPDATE career_clusters SET "iconName" = 'ri-plant-line' WHERE name = 'Agriculture, Food, & Natural Resources';
UPDATE career_clusters SET "iconName" = 'ri-building-line' WHERE name = 'Architecture & Construction';
UPDATE career_clusters SET "iconName" = 'ri-palette-line' WHERE name = 'Arts, A/V Technology & Communications';
UPDATE career_clusters SET "iconName" = 'ri-briefcase-line' WHERE name = 'Business Management & Administration';
UPDATE career_clusters SET "iconName" = 'ri-graduation-cap-line' WHERE name = 'Education & Training';
UPDATE career_clusters SET "iconName" = 'ri-money-dollar-circle-line' WHERE name = 'Finance';
UPDATE career_clusters SET "iconName" = 'ri-stethoscope-line' WHERE name = 'Health Science';
UPDATE career_clusters SET "iconName" = 'ri-hotel-line' WHERE name = 'Hospitality & Tourism';
UPDATE career_clusters SET "iconName" = 'ri-team-line' WHERE name = 'Human Services';
UPDATE career_clusters SET "iconName" = 'ri-computer-line' WHERE name = 'Information Technology';
UPDATE career_clusters SET "iconName" = 'ri-scales-line' WHERE name = 'Law, Public Safety, Corrections & Security';
UPDATE career_clusters SET "iconName" = 'ri-tools-line' WHERE name = 'Manufacturing';
UPDATE career_clusters SET "iconName" = 'ri-megaphone-line' WHERE name = 'Marketing';
UPDATE career_clusters SET "iconName" = 'ri-microscope-line' WHERE name = 'Science, Technology, Engineering & Mathematics';
UPDATE career_clusters SET "iconName" = 'ri-truck-line' WHERE name = 'Transportation, Distribution & Logistics';

-- Handle military branches
UPDATE career_clusters SET "iconName" = 'ri-ship-line' WHERE name = 'Navy';
UPDATE career_clusters SET "iconName" = 'ri-sword-line' WHERE name = 'Army';
UPDATE career_clusters SET "iconName" = 'ri-plane-line' WHERE name = 'Air Force';
UPDATE career_clusters SET "iconName" = 'ri-medal-line' WHERE name = 'Marines';
UPDATE career_clusters SET "iconName" = 'ri-anchor-line' WHERE name = 'Coast Guard';
UPDATE career_clusters SET "iconName" = 'ri-rocket-line' WHERE name = 'Space Force';

-- Set default icon for any remaining clusters without icons
UPDATE career_clusters SET "iconName" = 'ri-star-line' WHERE "iconName" IS NULL;