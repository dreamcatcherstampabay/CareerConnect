-- Fix column naming to match TypeScript schema
ALTER TABLE career_clusters RENAME COLUMN icon_name TO "iconName";
ALTER TABLE mentors RENAME COLUMN icon_name TO "iconName" IF EXISTS;