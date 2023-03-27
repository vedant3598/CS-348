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

select country, sum(case when (medal_achieved is null) then 0 else 1 end) as medal_count
from Athlete, Participates
where Athlete.id = Participates.athlete_id
group by country
order by medal_count desc;



/* Query 3: returns a countries super fans */

select id, first_name, surname
from User
where not exists (
  select id from Athlete where country = "USA"
  except
  select athlete_id from Favourites where user_id = User.id
);


/* Query 4: returns the athlete that wins the most medals, ranked*/

create view athlete_medals as
    select *
    from (
   	 select id, sum(case when (medal_achieved is null) then 0 else 1 end) as num_medals
   	 from Athlete join Participates on
   		  Athlete.id = Participates.athlete_id
   	 group by id
    ) as S join Athlete using(id);


select id, first_name, surname, country, num_medals, rank() over (order by (num_medals) desc) as medal_rank
from (
  select id, num_medals
  from athlete_medals
  group by id
) as T join Athlete using(id);

drop view athlete_medals;


/* Query 5: removes an athlete from a user’s dashboard who had previously favourited that particular athlete*/

delete from Favourites where user_id = 2 and athlete_id = 3;


/* Query 6: returns average age, height, and weight for the specified country*/

select Country.country_code, avg(age) as avg_age, avg(height) as avg_height, avg(weight) as avg_weight 
from (Country join Athlete on Country.country_code = Athlete.country) 
where country = "DEN" group by Country.country_code;