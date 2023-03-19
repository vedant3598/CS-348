/* Query 1: returns the number of gold, silver and bronze medals that all athletes have won in their entire olympic career */

select *,
    (select count(*)
    from Athlete, Participates
    where Athlete.id = Participates.athlete_id
    	and medal_achieved = 'Gold'
    	And Athlete.id = A.id) as count_gold,
	(select count(*)
	from Athlete, Participates
	where Athlete.id = Participates.athlete_id
         and medal_achieved = 'Silver'
         And Athlete.id = A.id) as count_silver,
	(select count(*)
	from Athlete, Participates
	where Athlete.id = Participates.athlete_id
        	and medal_achieved = 'Bronze'
        	And Athlete.id = A.id) as count_bronze
from Athlete as A;


/* Query 2: returns the number of medals for each country in descending order */

select country, count(*) as medal_count
from Athlete, Participates
where Athlete.id = Participates.athlete_id and medal_achieved is not null
group by country
order by medal_count desc;


/* Query 3: returns information about the country’s performance at the olympics and the athletes that have participated for this country */

select id, first_name, surname
from User
where not exists (
  select id from Athlete where country = "United States"
  except
  select athlete_id from Favourites where user_id = User.id
);


/* Query 4: returns the athlete that wins the most medals for each event */

create view athlete_medals as select *
    from (
        select id, event_name, count(*) as num_medals
        from Athlete join Participates on Athlete.id = Participates.athlete_id 
        where Participates.medal_achieved is not null
        group by id, event_name
    ) as S join Athlete using(id);

select id, first_name, surname, country, event_name, most_medals
from (
    select event_name, id, max(num_medals) as
    most_medals
    from athlete_medals
    group by event_name, id
    order by most_medals desc
) as T join Athlete using(id);


