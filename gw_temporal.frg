#lang forge/temporal

option verbose 2
option max_tracelength 12
option min_tracelength 12

abstract sig Position {}
one sig Near extends Position {}
one sig Far extends Position {}

abstract sig GWAnimal { var p: one Position }
sig Goat extends GWAnimal {}
sig Wolf extends GWAnimal {}
sig Boat { var pos: one Position }

pred GWinitState {
    // The boat and all animals start on the near side
    all a: GWAnimal | a.p = Near
    Boat.pos = Near
}

pred GWfinalState {
    // All animals and the boat must end on the far side
    all a: GWAnimal | a.p = Far
    Boat.pos = Far
}

pred GWcanTransition {
    // - the boat must move
    Boat.pos != Boat.pos'

    // - the boat can carry 1-2 animals (not zero!)
    let animals_with_boat = #{a: GWAnimal | a.p = Boat.pos} |
    let animals_left_behind = #{a: GWAnimal | a.p' = Boat.pos} |
    let animals_taken = subtract[animals_with_boat, animals_left_behind] |
      (animals_taken = 1 or animals_taken = 2)

    // - every other animal stays in the same place
    all a: GWAnimal | a.p != Boat.pos => a.p' = Boat.pos'
}

pred GWNeverEating {
    // Never have goats outnumbered by wolves on either side.
    let num_near_wolfs = #{a: Wolf | a.p = Near} |
    let num_near_goats =  #{a: Goat | a.p = Near} |
      num_near_goats != 0 => num_near_goats >= num_near_wolfs
    let num_far_wolfs = #{a: Wolf | a.p = Far} |
    let num_far_goats = #{a: Goat | a.p = Far} |
      num_far_goats != 0 => num_far_goats >= num_far_wolfs
}

run {
  GWinitState
  always {
    GWNeverEating
    GWcanTransition
  }
  eventually GWfinalState
} for exactly 6 GWAnimal,
  exactly 3 Goat,
  exactly 3 Wolf,
  exactly 1 Boat,
  5 Int
