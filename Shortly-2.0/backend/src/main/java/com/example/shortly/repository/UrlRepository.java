package com.example.shortly.repository;

import com.example.shortly.model.Url;
import com.example.shortly.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface UrlRepository extends JpaRepository<Url, Long> {
    Optional<Url> findByShortCode(String shortCode);
    boolean existsByShortCode(String shortCode);
    List<Url> findByUserOrderByCreatedAtDesc(User user);
    List<Url> findAllByOrderByCreatedAtDesc();
    long countByUser(User user);

    @Query("SELECT SUM(u.clickCount) FROM Url u WHERE u.user = :user")
    Long sumClicksByUser(@Param("user") User user);

    @Query("SELECT SUM(u.clickCount) FROM Url u")
    Long sumAllClicks();

    @Query("SELECT u FROM Url u WHERE u.user = :user ORDER BY u.clickCount DESC LIMIT 1")
    Optional<Url> findMostClickedByUser(@Param("user") User user);

    @Query("SELECT u FROM Url u ORDER BY u.clickCount DESC LIMIT 1")
    Optional<Url> findMostClickedOverall();
}
